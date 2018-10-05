(ns kf1.views.ui.routes.main-menu.view
  (:require [kfGameEngine :as engine]))

(defn MainMenu [] 
  [:div {:class "ui-layer"}
   [:h2 {:class "f2"} "Welcome to kf1"]
   [:button 
    {:type "button" 
     :onClick (fn [] (engine.sceneManager.pushScene "levelOne"))}
    "Start"]])
