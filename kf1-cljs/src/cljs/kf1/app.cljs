(ns kf1.app
  (:require
    [reagent.core :as reagent]))

(defn App [a b c] 
  [:div {:class c}
   [:i a] " " b])

(defn complex-component [a b c]
  (let [state (reagent/atom {})] ;; you can include state
    (reagent/create-class
      {:component-will-mount
       (fn [] (println "I mounted"))

       ;; ... other methods go here
       ;; see https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle
       ;; for a complete list

       ;; name your component for inclusion in error messages
       :display-name "complex-component"

       ;; note the keyword for this method
       :render-reagent App })))
