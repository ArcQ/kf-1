(ns kf1.app
  (:require
    [reagent.core :as reagent]
    [kf1.views.ui.core :as ui]
    [kf1.views.game.core :as game])) 

(defn App [props]
  (let [state (reagent/atom {})] ;; you can include state
    (reagent/create-class
      {:component-will-mount 
       (fn [] (.replaceToken (:history props) "/" ))
       :reagent-render 
       (fn [props] 
         [:div { :class "app"}
          [:div {:class "ui"}
           [ui/view props]]
          [:div {:class "game"}
           [game/view props]]]) })))
