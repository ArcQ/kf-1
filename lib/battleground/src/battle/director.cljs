(ns battle.director
  (:require [battle.director_functions.moveChar :refer (moveChar)]))

(defn control [opts inputDef startEndF]
  (case (:type inputDef)
    "charMove" (moveChar "goblin" inputDef opts startEndF)))
