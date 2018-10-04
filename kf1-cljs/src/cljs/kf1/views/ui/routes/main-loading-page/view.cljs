(ns kf1.views.game.scenes.loading.main
  (:require [reframe.core :as rf]
            [kfGameEngine :refer (utils)]
            [kf1.subs :as subs]))

(defn MainLoadingScene [] 
  (let [loadingPercentage (rf/subscribe [:loadingPercentage])]
    [:div {:class "ui-layer"}
     [:img {:alt "logo" :src (utils.getImgSrc "framework-images/test-loading-1s-200px.svg")}]
     [:h2 {:class "f1"} 
      "Loading..."
      [:span {:class "ph3"}
       @loadingPercentage]]]))
