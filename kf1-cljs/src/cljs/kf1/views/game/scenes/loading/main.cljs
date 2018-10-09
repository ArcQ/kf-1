(ns kf1.views.game.scenes.loading.main
  (:require
    [re-frame.core :as re-frame]
    [kf1.utils.engine-interface :refer [getSprite]]))

(defn getSceneObj [] 
  {
   :name "mainLoadingScene"
   :uiRoute "/loading/main"
   :assets ["mainLoading"]
   :onFinishLoad (fn [stage] 
                   (-> (doto (getSprite "mainLoading" "loading-animation")
                         (goog.object/set "x" 0)
                         (goog.object/set "y" 0)
                         (goog.object/set "width" 90)
                         (goog.object/set "height" 160)))
                   (stage.addChild))
   })
