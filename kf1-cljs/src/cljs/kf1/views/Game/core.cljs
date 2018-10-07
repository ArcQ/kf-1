(ns kf1.views.game.core
  (:require
    [re-frame.core :as re-frame]
    [kf1.utils.recompose :refer [withRefHandlers, lifecycle]]
    [reagent.core :as reagent]
    [kf1.config :as config]
    [kfGameEngine :as engine]
    ))

(defn MainGameView [props]
  [:div {:id "mainGameContainer" 
         :className "relative"
         :ref (partial (:setRef props) "gameView")}])

(defn initPixi [mainGameViewRef]
  (let [gameConfig (clj->js (config/game))]
    ((goog.object/get engine "start") gameConfig mainGameViewRef)
    ((goog.object/getValueByKeys engine ["sceneManager" "start"]) gameConfig))) 

(defn initPixiOnMount [component]
  (lifecycle {:component-did-mount
              (fn [component [_ p]] 
                (let [props (reagent/props component)
                      handleRef (:handleRef props)]
                  (handleRef "gameView" (fn [mainGameViewRef]
                                          (initPixi mainGameViewRef)))))}) component)

(def view ((comp withRefHandlers initPixiOnMount) MainGameView))
