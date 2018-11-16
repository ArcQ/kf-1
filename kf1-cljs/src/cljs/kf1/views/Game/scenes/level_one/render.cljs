(ns kf1.views.Game.scenes.level-one.render
  (:require [kfGameEngine :as engine]
            [kf1.utils.engine-interface :refer [drawTargetCircle setPos addChildToStage getSprite]]))

(def TILE_SIZE 60)

(def GAMEMAP_TO_TEXTURE [
  "grassTexture",
  "sandTexture",
  "waterTexture",
  "mountainTexture",
])

(defn createTile [v, x, y]
  (doto (getSprite "levelOne" (GAMEMAP_TO_TEXTURE k))
    (goog.object/set "x" (* x TILE_SIZE))
    (goog.object/set "y" (* y TILE_SIZE))
    (goog.object/set "width" TILE_SIZE)
    (goog.object/set "height" TILE_SIZE)))

(defn initialRender [gameMap initialPState]
  (let [tileMap (->> (createTileMap gameMap)
                     (map #(addChildToStage %1)))]
    (letfn [(charKeysReducer [acc k] 
              (let [sprite ((:sprite (characters k)) 
                            (get-in initialPState [k, "pos"]))]
                (addChildToStage sprite)
                (merge acc {(keyword k) sprite})))]
      (let [sprites (->> ["goblin" "assasin" "wizard" "demon"]
                         (reduce charKeysReducer {}))
            moveTargetCircle (drawTargetCircle (get-in initialPState [:moveTargetCircle :pos]))]
        (addChildToStage moveTargetCircle)
        (merge sprites {:moveTargetCircle moveTargetCircle}) ))))

(defn render [gameState]
  (if (or (not (empty? gameState)))
    (do 
      (if (get-in gameState [:moveTargetCircle :isShow])
        (do 
          (set! (.-visible (:moveTargetCircle spriteStore)) true)
          (setPos (:moveTargetCircle spriteStore) (get-in gameState [:moveTargetCircle :pos])))
        (set! (.-visible (:moveTargetCircle spriteStore)) false))
      (setPos (:goblin spriteStore) (get-in gameState [:goblin :pos]))
      (setPos (assasin spriteStore) (get-in gameState [:assasin :pos])))))
