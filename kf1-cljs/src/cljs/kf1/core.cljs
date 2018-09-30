(ns kf1.core
  (:require
   [reagent.core :as reagent]
   [re-frame.core :as re-frame]
   [kf1.events :as events]
   [kf1.routes :as routes]
   [kf1.views :as views]
   [kf1.config :as config]
   [kf1.app :as app]))

(defn dev-setup []
  (when config/debug?
    (enable-console-print!)
    (println "dev mode")))

(defn mount-root []
  (re-frame/clear-subscription-cache!)
  (reagent/render [views/main-panel]
                  (.getElementById js/document "app")))

(defn ^:export init []
  (routes/app-routes)
  (re-frame/dispatch-sync [::events/initialize-db])
  (dev-setup)
  (mount-root))
