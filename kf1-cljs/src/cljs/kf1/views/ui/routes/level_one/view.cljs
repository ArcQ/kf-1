(ns kf1.views.ui.routes.level-one.view
  (:require [re-frame.core :as rf]
            [kfGameEngine :refer (utils)]))

(defn LevelOne [props] 
  (let [isPaused (rf/subscribe [:isPaused])]
    (if isPaused [:div 
                  [:h2 {:class "f1"} 
                   "Paused"]])))
