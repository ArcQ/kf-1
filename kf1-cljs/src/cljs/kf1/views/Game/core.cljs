(ns kf1.views.game.core
  (:require
    [re-frame.core :as re-frame]
    [kf1.views.Game.scenes.core :refer [sceneDict]]
    [kf1.utils.recompose :refer [withRefHandlers, lifecycle]]
    [reagent.core :as reagent]
    [kf1.config :as config]
    [kfGameEngine :as engine :refer [utils]]
    ))

(defn MainGameView [props]
  [:div {:id "mainGameContainer" 
         :className "relative"
         :ref (partial (:setRef props) "gameView")}])

(defn initPixi [props mainGameViewRef]
  (letfn [(pushScene [r] (.setToken (:history props) r))]
    (let [gameConfig (clj->js config/game)
          engineStart (goog.object/getValueByKeys kfGameEngine #js ["default" "start" ])
          sceneStart (goog.object/getValueByKeys kfGameEngine #js ["default" "sceneManager" "start" ])]
      (engineStart gameConfig mainGameViewRef pushScene)
      (sceneStart gameConfig (clj->js sceneDict) )))) 

(def initPixiOnMount 
  (lifecycle {:component-did-mount
              (fn [component props] 
                ((:handleRef props) "gameView" 
                 (fn [mainGameViewRef]
                   (initPixi props mainGameViewRef))))}))

(def view ((comp withRefHandlers initPixiOnMount) MainGameView))
