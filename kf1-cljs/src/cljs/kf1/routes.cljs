(ns kf1.routes
  (:require-macros [secretary.core :refer [defroute]])
  (:import goog.history.Html5History)
  (:require [secretary.core :as secretary]
            [goog.events :as events]
            [goog.history.EventType :as EventType]
            [re-frame.core :as rf]))

(def routes 
  [["/" :home] 
   ["/main-loading" :main-loading-page]
   ["level-one" :leve-one]])

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
  (map #(defroute 
          (% 1) [] (rf/dispatch [:set-active-route (% 2)])) 
       routes)
  (hook-browser-navigation!))
