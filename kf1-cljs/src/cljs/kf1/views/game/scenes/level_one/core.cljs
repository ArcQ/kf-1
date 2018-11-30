(ns kf1.views.game.scenes.level-one.core
  (:require [kf1.views.Game.scenes.level-one.api :as api]
            [kf1.views.game.scenes.loading.main :as mainLoadingScene]
            ;; [kf1.views.game.scenes.loading.eventSources :as event-sources]
            [kf1.views.game.scenes.level-one.render :as render]
            [kf1.views.game.scenes.level-one.events :as events]))

;; (defn updateFn [args] (prn "updateFn") (prn args))
(defn updateFn [args] (identity 1))
(defn start [args] (prn "start") (prn args))

(defn getLevelOne []
  (clj->js {:name "level-one-scene"
            :loading mainLoadingScene/getSceneObj
            :uiRoute "/level-one"
            :assets ["goblins" "chars" "levelOne"]
            :willLoad api/generateGameMap
            ;; :eventSources eventSources 
            :gameFnNames {
                    :start "level_one_init"
                    :update "level_one_tick" } 
            :start render/initialRender
            :update updateFn
            ;; :onFinishLoad onFinishLoad
            }))
