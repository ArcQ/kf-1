(ns kf1.core
  (:require [garden.core :refer [css]]
            [garden.def :refer [defrule defkeyframes defstyles]]))

(defkeyframes app-logo-spin
  [:from
   {:transform "rotate(0deg)"}]

  [:to
   {:transform "rotate(360deg)"}])

(defstyles core 
  {:vendors ["webkit"]}
  app-logo-spin
  [:body { 
          :margin "0" 
          :padding "0" 
          :font-family "sans-serif" }] 
  [:html :body :#root :.full-screen { 
                                     :width "100%"
                                     :height "100%" 
                                     :position "absolute" }]
  [:.app { 
          :text-align
          "center" }]

  [:app-logo 
   ^:prefix {:animation [[app-logo-spin :infinite "20s" :linear]] :height "80px" }]

  [:.ui-layer {
               :position "absolute" 
               :z-index "100" 
               :width "100%"
               :height "100%"
               :padding "20px" 
               :background-color "rgba(0,0,0,0.7)"
               :color "white" }]

  [:.ui-layer {
               :position "absolute" 
               :z-index "100" 
               :width "100%"
               :height "100%"
               :padding "20px" 
               :background-color "rgba(0,0,0,0.7)"
               :color "white" }]

  [:.app-intro {
                :font-size "large" }]

  [:.border-button {
                    :padding ["0.875rem" "1rem"] 
                    :border ["1px" "solid" "white"] }])

(defstyles levelOne
  [:#own-hp-bar { :height "50px" }])

(def styles (merge core levelOne))
