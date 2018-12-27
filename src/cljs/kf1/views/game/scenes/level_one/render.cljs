(ns kf1.views.game.scenes.level-one.render
  (:require [kfGameEngine :as engine]
            [oops.core :refer [oset! ocall! oget]]
            [kf1.views.Game.scenes.level-one.api :refer [nonUiState]]
            [kf1.views.game.scenes.level-one.items.characters :refer [charactersDict]]
            [kf1.utils.engine-interface :refer [drawTargetCircle setPos! addChildToStage getSprite]]))

(def RENDER_KEYS (atom []))

(def TILE_SIZE 60)

(def GAMEMAP_TO_TEXTURE [
                         "grassTexture",
                         "sandTexture",
                         "waterTexture",
                         "mountainTexture",
                         ])

(def spriteStore (atom {}))

(defn createTile [v, x, y]
  (doto (getSprite "levelOne" (GAMEMAP_TO_TEXTURE v))
    (oset! "x" (* x TILE_SIZE))
    (oset! "y" (* y TILE_SIZE))
    (oset! "width" TILE_SIZE)
    (oset! "height" TILE_SIZE)))

(defn createTileMap [gameMap]
  (-> (fn [y row]  (map-indexed (fn [x v] (createTile v x y)) row))
      (map-indexed gameMap)
      (flatten)))

(defn initialRender []
  (let [initialPos {:goblin [100 100] :assasin [200 200] :moveTargetCircle [0 0]}
        gameMap (:gameMap @nonUiState)
        tileMap (doall (->> (createTileMap gameMap)
                            (map #(addChildToStage %1))))]
    (letfn [(charKeysReducer [acc k] 
              (let [sprite ((:sprite (get charactersDict k)) 
                            (k initialPos))]
                (addChildToStage sprite)
                (merge acc {k sprite})))]
      (let [sprites (->> [:goblin :assasin]
                         (reduce charKeysReducer {}))
            moveTargetCircle (drawTargetCircle (:moveTargetCircle initialPos))]
        (oset! moveTargetCircle :visible false)
        (addChildToStage moveTargetCircle)
        (swap! spriteStore merge sprites {:moveTargetCircle moveTargetCircle})))))

;; reduce #(split) {cur dict} [restbytes]
(defn setSpritePos! [nextPosState]
  (let [jsPos (-> (ocall! nextPosState :slice -2))
        pos [(aget jsPos 0) (aget jsPos 1)]]
    (condp = (aget nextPosState 0)
      (.indexOf @RENDER_KEYS "KEY_TARGET_CIRCLE") (doto (:moveTargetCircle @spriteStore)
                                                    (setPos! pos)
                                                    (oset! :visible true))
      (.indexOf @RENDER_KEYS "KEY_ASSASIN") (do
                                              (setPos! (:assasin @spriteStore) pos)))))

(defn handleSubState [subState]
  (let [subStateLen (aget subState 0)
        k (aget subState 1)]
    (condp = k
      (.indexOf @RENDER_KEYS "KEY_SET_SPRITE_POS") (setSpritePos! 
                                                (ocall! subState :slice 2))))
  )

(defn decodeByteArray [gameStateByteArray]
  (loop [i 1]
    (when (< i (aget gameStateByteArray 0))
      (let [subStateLen (aget gameStateByteArray i)
            subStateEndI (+ i subStateLen)]
        (handleSubState (ocall! gameStateByteArray :slice i subStateEndI))
        (recur subStateEndI)))))

(defn tick [renderKeys]
  (swap! RENDER_KEYS concat renderKeys)
  (fn [gameStateByteArray] 
    (if (not (nil? gameStateByteArray))
      (decodeByteArray gameStateByteArray))))
