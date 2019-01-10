(ns kf1.views.game.scenes.level-one.core
  (:require [kf1.views.Game.scenes.level-one.api :as api]
            [kf1.views.game.scenes.loading.main :as mainLoadingScene]
            [kf1.views.Game.scenes.level-one.event-listeners :as eventListeners]
            [kf1.views.game.scenes.level-one.render :as render]))
;; no more significance of keeping track of keys, might as well just make this an array and base it off of indexes
(def encoderKeys [ 
                  "NO_CHANGE"
                  "P1"
                  "P2"
                  "SET_CHAR_STATE"
                  "SET_SPRITE_POS"
                  "CHANGE_ORIENTATION"
                  "MOVE" 
                  "IDLE"
                  "SPOT_ATTACK"
                  "FINISH_SPOT_ATTACK"
                  ])

(defn encode [k]
  (.indexOf encoderKeys k))

(defn getLevelOne []
  (clj->js {:name "level-one-scene"
            :encoderKeys encoderKeys
            :loading mainLoadingScene/getSceneObj
            :uiRoute "/level-one"
            :assets ["chars" "levelOne"]
            :willLoad api/generateGameMap
            :start (fn [] 
                                (render/initialRender)
                                (eventListeners/watchEvents encode))
            :update (render/tick encode)
            }))
