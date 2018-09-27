(ns battle.director.core
  (:require [battle.director.director_functions.moveChar :refer (moveChar)]))

(defn updateGameState [gameState]
  (fn [jsKvArray]
    (swap! gameState merge (js->clj jsKvArray))))

(defn control [gameState framesAndEvents$ dt inputDef {start :start end :end}]
  (case (goog.object/getValueByKeys inputDef #js ["type"])
    "charMove" (do 
                 (start (updateGameState gameState) inputDef)
                 (moveChar 
                   (goog.object/getValueByKeys inputDef #js ["key"]) 
                   gameState
                   framesAndEvents$ 
                   dt 
                   (goog.object/getValueByKeys inputDef #js ["pos"]))
                 (end (updateGameState gameState) inputDef)
                 "hi")))
