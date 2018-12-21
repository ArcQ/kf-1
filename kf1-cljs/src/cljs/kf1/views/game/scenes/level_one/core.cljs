(ns kf1.views.game.scenes.level-one.core
  (:require [kf1.views.Game.scenes.level-one.api :as api]
            [kf1.views.game.scenes.loading.main :as mainLoadingScene]
            [kf1.views.Game.scenes.level-one.event-sources :as eventSources]
            [kf1.views.game.scenes.level-one.render :as render]))

;; (defn updateFn [args] (prn "updateFn") (prn args))
(defn start [args] (prn "start") (prn args))

(def eventKeys { "click" 0 })

(def renderKeys { 
              "KEY_GOBLIN" 0
              "KEY_ASSASIN" 1
              "KEY_TARGET_CIRCLE" 2
              "KEY_SET_SPRITE_POS" 3})

(defn getLevelOne []
  (clj->js {:name "level-one-scene"
            :eventKeys eventKeys
            :renderKeys renderKeys
            :loading mainLoadingScene/getSceneObj
            :uiRoute "/level-one"
            :assets ["goblins" "chars" "levelOne"]
            :willLoad api/generateGameMap
            :eventSources eventSources/eventsMap
            :gameFnNames {
                    :start "level_one_init"
                    :update "level_one_tick" } 
            :start render/initialRender
            :update (render/tick renderKeys)
            }))
