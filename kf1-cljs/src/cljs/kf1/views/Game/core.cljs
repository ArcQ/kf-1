(ns kf1.views.game.core
  (:require
    [re-frame.core :as re-frame]
    [kf1.utils.recompose :refer [withRefHandlers, lifecycle]]
    [reagent.core :as reagent]
    [kf1.config :as config]
    [kfGameEngine :as engine]
    [kf1.subs :as subs]
    ))

(defn MainGameView [props]
  [:div {
         :id "mainGameContainer" 
         :className "relative"
         :ref (:handleRef props)}])

(defn initPixi [mainGameViewRef]
  (let [gameConfig (config/game)]
    ((goog.object/get engine "start") gameConfig mainGameViewRef)
    ((goog.object/get sceneManager "start") gameConfig))) 

(defn initPixiOnMount []
  (lifecycle {:component-did-mount
              (fn [component] 
                (let [props (reagent/props component)
                      handleRef (:handleRef props)]
                  (handleRef (fn [mainGameViewRef]
                               (initPixi mainGameViewRef)))))}))

(def view ((comp
             (withRefHandlers)
             (initPixiOnMount)) MainGameView))
;; (def view MainGameView)
