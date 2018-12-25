(ns kf1.views.Game.scenes.level-one.api
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [kfGameEngine :as engine]
            [cljs-http.client :as http]
            [cljs.core.async :refer [<!]]))

;; (apply hash-map (mapcat vector ["x" "y"]
;;                         (map 
;;                           #(/ % TILE_SIZE) 
;;                           (js->clj (goog.object/getValueByKeys kfGameEngine #js ["web" "screen" "bounds"])))))

(def nonUiState (atom {}))

(def TILE_SIZE 60)
(defn generateGameMap []
  (let [body (->> (goog.object/getValueByKeys kfGameEngine #js ["default" "web" "screen" "bounds"])
                  (js->clj)
                  (map #(/ % TILE_SIZE))
                  (mapcat vector ["x" "y"]) 
                  (apply hash-map))]
    (go (let [response (<! (http/get "http://localhost:7000/gamemap/generate" 
                                     {:with-credentials? false
                                      :query-params body}))
              gameMap (-> (.parse js/JSON (response :body))
                          (js->clj :keywordize-keys true))]
          (swap! nonUiState merge gameMap)))))
