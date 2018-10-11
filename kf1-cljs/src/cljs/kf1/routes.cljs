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

(def routesMap
  {:home ["/" MainMenu] 
   :main-loading-page ["/main-loading" MainLoadingPage]
   :level-one ["level-one" LevelOne]
   :default ["*" (fn [props] [:div])]})

(defn getRouteDefs []
  (defmulti routeDefs identity)
  (doall (map (fn [[k v]] 
                  (defmethod routeDefs k [_k props] [(second v) props])) 
              routesMap))
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
  (doall (map (fn [[k v]] (defroute (first v) [] 
                            (rf/dispatch [:set-active-route k]))) 
       routesMap))
  (hook-browser-navigation!))
