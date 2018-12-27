(ns kf1.views.game.scenes.level-one.core
  (:require [kf1.views.Game.scenes.level-one.api :as api]
            [kf1.views.game.scenes.loading.main :as mainLoadingScene]
            [kf1.views.Game.scenes.level-one.event-listeners :as eventListeners]
            [kf1.views.game.scenes.level-one.render :as render]))
;; no more significance of keeping track of keys, might as well just make this an array and base it off of indexes
(def encoderKeys [ 
                  "NO_CHANGE"
                  "KEY_GOBLIN"
                  "KEY_ASSASIN"
                  "KEY_TARGET_CIRCLE"
                  "KEY_SET_SPRITE_POS"
                  "MOVE" 
                  "IDLE"
                  "SPOT_ATTACK"
                  "BLAH"
                  ])

(defn getLevelOne []
  (clj->js {:name "level-one-scene"
            :encoderKeys encoderKeys
            :loading mainLoadingScene/getSceneObj
            :uiRoute "/level-one"
            :assets ["chars" "levelOne"]
            :willLoad api/generateGameMap
            :start (fn [] 
                                (render/initialRender)
                                (eventListeners/watchEvents encoderKeys))
            :update (render/tick encoderKeys)
            }))
