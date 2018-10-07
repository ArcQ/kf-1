(ns kf1.views.ui.routes.main-menu.view
  (:import goog.history.Html5History)
  (:require [re-frame.core :as rf] 
            [kfGameEngine :as engine]))

(defn MainMenu [props] 
  [:div {:class "ui-layer"}
   [:h2 {:class "f2"} "Welcome to kf1"]
   [:button 
    {:type "button" 
     :onClick (fn [] 
                (.setToken (:history props) "/main-loading"))}
    "Start"]])
