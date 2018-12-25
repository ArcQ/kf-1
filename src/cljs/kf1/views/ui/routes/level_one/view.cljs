(ns kf1.views.ui.routes.level-one.view
  (:require [re-frame.core :as rf]
            [kfGameEngine :refer (utils)]))
  
(defn LevelOne [props] 
  (let [isPaused (rf/subscribe [:isPaused])]
    [:div {:id "ui" :class "ui absolute h-100 w-100 z-1"}
     [:h1 "HI"]
     (if isPaused [:div 
                   [:h2 {:class "f1"} 
                    "Paused"]])
    [:div {:class "absolute bottom-0"}
     [:button {:id "attackOneBtn" :class "f1"} "ATTACK"]] ]))
