(ns kf1.routes
  (:require-macros [secretary.core :refer [defroute]])
  (:import goog.history.Html5History)
  (:require [secretary.core :as secretary]
            [goog.events :as events]
            [goog.history.EventType :as EventType]
            [re-frame.core :as re-frame]))

(defn hook-browser-navigation! []
  (doto (Html5History.)
    (events/listen
     EventType/NAVIGATE
     (fn [event]
       (secretary/dispatch! (.-token event))))
    (.setUseFragment false)
    (.setPathPrefix "")
    (.setEnabled true)))

(defn app-routes []
  (defroute "/" []
    (re-frame/dispatch [:set-active-route :home-panel]))
  
  (defroute "/profile" []
    (re-frame/dispatch [:set-active-route :profile-panel]))

  (hook-browser-navigation!))
