(ns kf1.views.game.scenes.loading.main
  (:require [reframe.core :as rf]
            [kfGameEngine :refer (utils)]
            [kf1.subs :as subs]))

(defn LevelOne [props] 
  (let [isPaused (rf/subscribe [:isPaused])]
    (if isPaused [:<> 
                  [:h2 {:class "f1"} 
                   "Paused"
                   ]])))
