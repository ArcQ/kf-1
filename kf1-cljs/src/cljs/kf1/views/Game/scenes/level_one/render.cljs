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
        (addChildToStage moveTargetCircle)
        (swap! spriteStore merge sprites {:moveTargetCircle moveTargetCircle})))))

(defn decodeSubState [subState]
  (prn subState))

(defn decodeByteArray [gameStateByteArray]
  (loop [i 1]
    (when (< i (aget gameStateByteArray 0))
      (let [subStateLen (aget gameStateByteArray i)
            subStateEndI (+ i subStateLen)]
        (decodeSubState (ocall! gameStateByteArray :slice i subStateEndI))
        (recur subStateEndI)))))

(defn tick [gameStateByteArray]
  ;; (if (or (not (empty? gameState)))
  ;; (do 
  ;; (if (get-in gameState [:moveTargetCircle :isShow])
  ;;   (doto (:moveTargetCircle spriteStore)
  ;;     (oset! "visible" true)
  ;;     (setPos!(get-in gameState [:moveTargetCircle :pos])))
  ;;   (set! (.-visible (:moveTargetCircle spriteStore)) false))
  ;; (setPos! (:goblin spriteStore) (get-in gameState [:goblin :pos]))

  ;; (let [gameState (ocall! gameStateByteArray :values)]
  ;;   (prn (type (ocall! gameStateByteArray))))
  ;; (setPos! (:assasin spriteStore) [(aget gameState 1) (aget gameState 2)])
  (if (not (nil? gameStateByteArray))
    (decodeByteArray gameStateByteArray))
  ;; (doseq [v gameStateByteArray]
  ;;   (prn v))
  ;; (setPos! (:moveTargetCircle @spriteStore) [(aget gameStateByteArray ) (aget gameStateByteArray 2)])
  ;; (setPos! (:assasin @spriteStore) [(aget gameStateByteArray ) (aget gameStateByteArray 2)])
  ;; )
  )
