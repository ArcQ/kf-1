(ns kf1.app
  (:require
    [reagent.core :as reagent]))

(defn App [] 
  [:div])

(defn EnhancedApp [props]
  (let [state (reagent/atom {})] ;; you can include state
    (reagent/create-class
      {:component-will-mount (fn [] (.replaceToken (:history props) "/" ))
       :render (fn [] [:div]) })))
