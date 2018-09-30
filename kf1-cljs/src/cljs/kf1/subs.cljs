(ns kf1.subs
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require
    [re-frame.core :as re-frame]))

(re-frame/reg-sub
  ::name
  (fn [db]
    (:name db)))

(re-frame/reg-sub
  :active-route
  (fn [db _]
    (reaction (:active-route @db))))
