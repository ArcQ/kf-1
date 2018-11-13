(ns kf1.views.Game.scenes.level-one.render
  (:require [kfGameEngine :as engine
             kf1.utils.engine-interface :refer :all]))

(defn initialRender [gameMap initialPState]
  (let [tileMap (->> (createTileMap gameMap)
                     (map #(addChildToStage %1)))
        (letfn [(charKeysReducer [acc k] 
                  (let [sprite (:sprite (characters k)) (get-in initialPState [k, "pos"])]
                    (addChildToStage sprite)
                    (merge acc {(keyword k) sprite})))]
          (let [sprites (->> ["goblin" "assasin" "wizard" "demon"]
                             (reduce charKeysReducer {}))
                moveTargetCircle (drawTargetCircle (get-in initialPState [:moveTargetCircle :pos]))]
            (addChildToStage moveTargetCircle)
            (merge sprites {:moveTargetCircle moveTargetCircle}) ))]))

(defn render [gameState]
  (if (or (not (empty? gameState)))
    (if (get-in gameState [:moveTargetCircle :isShow])
      (set! (-.visible (:moveTargetCircle spriteStore)) true)
      (setPos (:moveTargetCircle spriteStore) (get-in gameState [:moveTargetCircle :pos]))
      (set! (-.visible (:moveTargetCircle spriteStore)) false))
    (setPos (:goblin spriteStore) (get-in gameState [:goblin :pos]))
    (setPos (assasin spriteStore) (get-in gameState [:assasin :pos]))))
