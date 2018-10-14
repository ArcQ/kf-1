(ns kf1.views.game.scenes.level-one.core
  (:require [kf1.views.game.scenes.loading.main :as mainLoadingScene]))

(defn getLevelOne []
   (clj->js {:name "leve-one-scene"
            :loading mainLoadingScene/getSceneObj
            :uiRoute "/level-one"
            :assets ["goblins", "chars"]
            ;; :load (generateGameMap)
            ;; :eventSources eventSources 
            ;; :start start
            ;; :update update
            ;; :onFinishLoad onFinishLoad
            }))
