(ns kf1.views.Game.scenes.level-one.api
  (:require [kfGameEngine :as engine :refer [utils]]))
;; not done yet
(defn generateGameMap []
  (engine.utils/request 
    "/gamemap/generate" 
    (apply hash-map 
           (mapcat vector [:x :y] 
                   (map #(/ % TILE_SIZE) engine.web.screen.bounds)))))
