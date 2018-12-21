(ns kf1.views.game.scenes.level-one.render
  (:require [kfGameEngine :as engine]
            [oops.core :refer [oset! ocall! oget]]
            [kf1.views.Game.scenes.level-one.api :refer [nonUiState]]
            [kf1.views.game.scenes.level-one.items.characters :refer [charactersDict]]
            [kf1.utils.engine-interface :refer [drawTargetCircle setPos! addChildToStage getSprite]]))

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

(def KEY_GOBLIN 0)
(def KEY_ASSASIN 1)
(def KEY_TARGET_CIRCLE 2)
(def KEY_SET_SPRITE_POS 3)

;; reduce #(split) {cur dict} [restbytes]
(defn setSpritePos! [nextPosState]
  (condp = (aget nextPosState 0)
    KEY_TARGET_CIRCLE (doto (:moveTargetCircle @spriteStore)
                        (setPos! [(aget nextPosState 1) (aget nextPosState 2)])
                        (oset! :visible true))
    KEY_ASSASIN (setPos! (:assasin @spriteStore) [(aget nextPosState 1) (aget nextPosState 2)])))

(defn decodeSubState [subState]
  (let [subStateLen (aget subState 0)
        k (aget subState 1)]
    (condp = k
      KEY_SET_SPRITE_POS (setSpritePos! 
                           (ocall! subState :slice 2))))
  )

(defn decodeByteArray [gameStateByteArray]
  (loop [i 1]
    (when (< i (aget gameStateByteArray 0))
      (let [subStateLen (aget gameStateByteArray i)
            subStateEndI (+ i subStateLen)]
        (decodeSubState (ocall! gameStateByteArray :slice i subStateEndI))
        (recur subStateEndI)))))

(defn tick [renderKeys]
  (fn [gameStateByteArray] 
    (if (not (nil? gameStateByteArray))
      (decodeByteArray gameStateByteArray))))
