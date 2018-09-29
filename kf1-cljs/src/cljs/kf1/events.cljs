(ns kf1.events
  (:require
   [re-frame.core :as re-frame]
   [kf1.db :as db]
   ))

(re-frame/reg-event-db
 ::initialize-db
 (fn [_ _]
   db/default-db))
