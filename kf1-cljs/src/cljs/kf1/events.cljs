(ns kf1.events
  (:require
   [re-frame.core :as rf]
   ))

(def eventsMap 
  {:initialize-db  (fn [db _]
                     {:loading-percentage 0})
   :set-active-route (fn [db [_ active-route]]
                       (assoc db :active-route active-route))})

(def simpleSubsMap 
  [:active-route :loading-percentage])

;; (rf/reg-sub
;;   :active-route
;;   (fn [db _]
;;     (:active-route db)))
;;
;; (rf/reg-sub
;;   :loading-percentage
;;   (fn [db _]
    ;; (:loading-percentage db)))

(doall (map (partial apply rf/reg-event-db) eventsMap))
(doall (map (fn [k] 
              (rf/reg-sub k (fn [db _] (k db))))  simpleSubsMap))
