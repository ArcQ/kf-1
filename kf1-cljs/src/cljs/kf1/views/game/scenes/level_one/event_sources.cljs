(ns kf1.views.Game.scenes.level-one.event-sources
  (:require [kfGameEngine :as engine :refer [utils]]))
;; not done yet
(defn eventSources []
  (engine.utils/request 
    "/gamemap/generate" 
    (apply hash-map 
           (mapcat vector [:x :y] 
                   (map #(/ % TILE_SIZE) engine.web.screen.bounds)))))
