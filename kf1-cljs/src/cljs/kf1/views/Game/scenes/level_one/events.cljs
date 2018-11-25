(ns kf1.views.game.scenes.level-one.events 
  (:require [re-frame.core :as rf]))

(def eventsMap 
  {:setGameMap (fn [db _]
                     {:gameMap nil})})

(def simpleSubsMap 
  [:gameMap])

(doall (map (partial apply rf/reg-event-db) eventsMap))
(doall (map (fn [k] 
              (rf/reg-sub k (fn [db _] (k db)))) simpleSubsMap))
