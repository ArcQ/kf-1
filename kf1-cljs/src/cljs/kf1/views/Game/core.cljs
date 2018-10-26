(ns kf1.views.game.core
  (:require
    [re-frame.core :as rf]
    ;; [kf1.views.Game.scenes.core :refer [sceneDict]]
    [kf1.utils.recompose :refer [withRefHandlers, lifecycle]]
    [reagent.core :as reagent]
    [kf1.config :as config]
    [re-frame.db :as rfdb]
    [kfGameEngine :as engine :refer [utils]]
    ))

(defn MainGameView [props]
  [:div {:id "mainGameContainer" 
         :className "relative"
         :ref (partial (:setRef props) "gameView")}])

(defn storeFn [props] {:dispatch (fn [action] (prn (.-path action))
                                   (-> (case (.-type action)
                                         "push-location" (not (.setToken (:history props) (.-path action)))
                                         false)
                                       ((fn [v] (if v (prn v) (rf/dispatch v))))))
                       :select (fn [ks] (get-in @rfdb/app-db (map #(keyword %) ks)))})

(defn runOnWasmLoad [cb] (if (= js/wasmLoaded true)
                           (cb)
                           (.addEventListener js/document "wasm_load" #(cb))) )

(defn initPixi [props mainGameViewRef]
  (runOnWasmLoad #(console.log (goog.object/getValueByKeys js/wasm_bindgen #js ["wasm" "memory"])))
  (letfn [(pushScene [r] (.setToken (:history props) r))]
    (let [gameConfig (clj->js config/game)
          engineStart (goog.object/getValueByKeys kfGameEngine #js ["default" "start" ])
          sceneStart (goog.object/getValueByKeys kfGameEngine #js ["default" "sceneManager" "start" ])]
      (engineStart gameConfig mainGameViewRef (clj->js (storeFn props)))
      ;; (sceneStart gameConfig (clj->js sceneDict) )
      ))) 

(def initPixiOnMount 
  (lifecycle {:component-did-mount
              (fn [component props] 
                ((:handleRef props) "gameView" 
                 (fn [mainGameViewRef]
                   (initPixi props mainGameViewRef))))}))

(def view ((comp withRefHandlers initPixiOnMount) MainGameView))
