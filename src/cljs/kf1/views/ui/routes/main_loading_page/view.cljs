(ns kf1.views.ui.routes.main-loading-page.view  
  (:require [re-frame.core :as rf]
            [kfGameEngine :refer [default]]))

(defn MainLoadingPage [] 
  (let [loading-percentage (rf/subscribe [:loading-percentage])]
    [:div {:class "ui-layer"}
     [:img {:alt "logo" :src ((goog.object/getValueByKeys kfGameEngine #js ["default" "utils" "getImgSrc"])  "framework-images/test-loading-1s-200px.svg")}]
     [:h2 {:class "f1"} 
      "Loading..."
      [:span {:class "ph3"}
       @loading-percentage]
      ]]))
