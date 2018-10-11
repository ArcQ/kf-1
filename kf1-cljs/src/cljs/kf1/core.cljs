(ns kf1.core
  (:require
    [reagent.core :as reagent]
    [re-frame.core :as re-frame]
    [kf1.events :as events]
    [kf1.routes :as routes]
    [kf1.config :as config]
    [kf1.app :as app]))

(defn dev-setup []
  (when config/debug?
    (enable-console-print!)
    (println "dev mode")))

(defn mount-root []
  (re-frame/clear-subscription-cache!)
  (reagent/render [(-> {:history (routes/app-routes)} 
                       app/App)]
                  (.getElementById js/document "app")))

(defn ^:export init []
  (re-frame/dispatch-sync [:initialize-db])
  (dev-setup)
  (mount-root))
