(ns kf1.views.game.core
  (:require
    [re-frame.core :as re-frame]
    [kf1.subs :as subs]
    ))

(defn LevelOneGameUi [] 
  [:div
    [:h1 "Hello from level one"]])

(defn MenuHome [] 
  [:div
    [:h1 "Hello" ]])

(defn Home [] 
  [:div
    [:h1 "Welcome to KF1" ]])

(defmulti panels identity)
(defmethod panels :menu-home [] [MenuHome])
(defmethod panels :level-one [] [LevelOneGameUi])
(defmethod panels :default [] [Home])

(defn view [props]
  (let [active-route (re-frame/subscribe [:active-route])]
    [:<>
     (panels @active-route)]))
