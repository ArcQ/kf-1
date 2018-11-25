(ns kf1.views.game.scenes.level-one.render
  (:require [kfGameEngine :as engine]
            [oops.core :refer [oset!]]
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
    (goog.object/set "x" (* x TILE_SIZE))
    (goog.object/set "y" (* y TILE_SIZE))
    (goog.object/set "width" TILE_SIZE)
    (goog.object/set "height" TILE_SIZE)))

(defn createTileMap [gameMap]
  (-> (fn [y] (map-indexed #(createTile %1 %2 y) gameMap))
      (flatten)))

(defn initialRender []
  (let [initialPos {:goblin [100 100] :assasin [300 100] :moveTargetCircle [0 0]}
        gameMap (:gameMap @nonUiState)
        tileMap (->> (createTileMap gameMap)
                     (map #(addChildToStage %1)))]
    (letfn [(charKeysReducer [acc k] 
              (let [_ (prn "k" k)
                    sprite ((:sprite (get charactersDict k)) 
                            (k initialPos))]
                (console.log sprite)
                (addChildToStage sprite)
                (merge acc {k sprite})))]
      (let [sprites (->> [:goblin :assasin]
                         (reduce charKeysReducer {}))
            moveTargetCircle (drawTargetCircle (:moveTargetCircle initialPos))]
        (addChildToStage moveTargetCircle)
        (swap! spriteStore (merge sprites {:moveTargetCircle moveTargetCircle}))))))

(defn render [gameState]
  (if (or (not (empty? gameState)))
    (do 
      (if (get-in gameState [:moveTargetCircle :isShow])
        (doto (:moveTargetCircle spriteStore)
          (oset! "visible" true)
          (setPos!(get-in gameState [:moveTargetCircle :pos])))
        (set! (.-visible (:moveTargetCircle spriteStore)) false))
      (setPos! (:goblin spriteStore) (get-in gameState [:goblin :pos]))
      (setPos! (:assasin spriteStore) (get-in gameState [:assasin :pos])))))
