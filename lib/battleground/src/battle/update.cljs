(ns battle.update
  (:require [battle.director :refer (control)]))

(defn ^:export updateF [gameLoopAttrs deltaTime inputState startEndF]
  (if (> (count inputState) 0)
    (map #(control gameLoopAttrs %2 startEndF) inputState)))
