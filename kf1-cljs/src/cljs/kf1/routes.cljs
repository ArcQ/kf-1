(ns kf1.routes
  (:require-macros [secretary.core :refer [defroute]])
  (:import goog.history.Html5History)
  (:require [secretary.core :as secretary]
            [goog.events :as events]
            [goog.history.EventType :as EventType]
            [kf1.views.ui.routes.level-one.view :refer [LevelOne]]
            [kf1.views.ui.routes.main-loading-page.view :refer [MainLoadingPage]]
            [kf1.views.ui.routes.main-menu.view :refer [MainMenu]]
            [re-frame.core :as rf]))

(def routesList
  [["/" :home MainMenu] 
   ["/main-loading" :main-loading-page MainLoadingPage]
   ["level-one" :level-one LevelOne]
   ["*" :default (fn [props] [:div])]])

(defn getRouteDefs []
  (defmulti routeDefs identity)
  (doall (map #(defmethod routeDefs (% 1) [k props] [(% 2) props]) routesList))
  routeDefs)

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
  (doall (map #(defroute 
          (% 0) [] (rf/dispatch [:set-active-route (% 1)])) 
       routesList))
  (hook-browser-navigation!))
