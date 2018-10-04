(ns kf1.views.ui.core
  (:require
    [re-frame.core :as rf]))

(defn LevelOneGameUi [] 
  [:div
    [:h1 "Hello from level one"]])

(defn MenuHome [] 
  [:div
    [:h1 "Hello" ]])

(defn Home [] 
  [:div
    [:h1 "Welcome to KF1" ]])

(defmulti routes identity)
(defmethod routes :menu-home [] [MenuHome])
(defmethod routes :level-one [] [LevelOneGameUi])
(defmethod routes :default [] [Home])

(defn view [props]
  (let [active-route (rf/subscribe [:active-route])]
    [:<>
     (routes @active-route)]))
