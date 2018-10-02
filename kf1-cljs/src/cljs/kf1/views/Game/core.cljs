(ns kf1.views.game.core
  (:require
    [re-frame.core :as re-frame]
    [reagent.core :as reagent]
    [kf1.config :as config]
    [kfGameEngine :as engine]
    [kf1.subs :as subs]
    ))

(defn MainGameView [props]
  (prn engine)
  [:div {
         :id "mainGameContainer" 
         :className "relative"
         :ref (:handleRef props)}])

(defn initPixi [mainGameViewRef store={}]
  (let [gameConfig (goog.object/get config "game")]
    ((goog.object/get engine "start") gameConfig mainGameViewRef store)
    ((goog.object/get sceneManager "start") gameConfig))) 

;; (defn initPixiOnMount 
;;   (lifecycle { :component-did-mount
;;               (fn [component] 
;;                 (let [props (reagnet/props component)
;;                       handleRef (:handleRef props)]
;;                   (handleRef (fn [mainGameViewRef store]
;;                                (initPixi mainGameViewRef store)))))}))

;; (def view ((comp
;;              (withRefHandlers)
;;              (initPixiOnMount)) MainGameView))
(def view MainGameView)
