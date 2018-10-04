(ns kf1.views.game.scenes.loading.main
  (:require [kfGameEngine :as engine]))

(defn MenuHome [] 
  [:div {:class "ui-layer"}
   [:h2 {:class "f2"} "Welcome to kf1"]
   [:button 
    {:type "button" 
     :onClick (fn [] (engine.sceneManager.pushScene "levelOne"))}
    "Start"]])
