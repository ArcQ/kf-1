(ns kf1.views.ui.routes.level-one.view
  (:require [re-frame.core :as rf]
            [kfGameEngine :refer (utils)]))

(defn hpBar [id cls]
  [:div {:id "own-hp-bar" :class (str "relative w-50 h-100 bg-gray " cls)} 
   [:div {:class "w-100 h-100 absolute bg-green" }]])
  
(defn LevelOne [props] 
  (let [isPaused (rf/subscribe [:isPaused])]
    [:div {:id "ui" :class "ui absolute h-100 w-100 z-1"}
     (hpBar "own-hp" "ma3")
     (if isPaused [:div 
                   [:h2 {:class "f1"} 
                    "Paused"]])
     [:div {:id "bottom-action-bar" :class "absolute bottom-0 w-100 pa3"}
      (hpBar "own-hp" "mr3 mb3")
      [:div { :class "tl w-100" }
       [:button {:id "attackOneBtn" :class "f1 pa3 br4"} "ATTACK"]]] ]))
