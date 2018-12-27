(ns kf1.events
  (:require
   [re-frame.core :as rf]
   ))

(def eventsMap 
  {:initialize-db  (fn [db _]
                     {:loading-percentage 0})
   :set-active-route (fn [db [_ active-route]]
                       (assoc db :active-route active-route))
   "GAME-ENGINE-SET-LOAD-PERCENTAGE" (fn [db [_ {p "percentage"}]]
                                     (assoc db :loading-percentage p))})

(def simpleSubsMap 
  [:active-route :loading-percentage])

(doall (map (partial apply rf/reg-event-db) eventsMap))
(doall (map (fn [k] 
              (rf/reg-sub k (fn [db _] (k db)))) simpleSubsMap))
