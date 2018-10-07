(ns kf1.views.ui.core
  (:require
    [re-frame.core :as rf]
    [kf1.routes :refer [getRouteDefs]]))

(def routeDefs (getRouteDefs))

(defn view [props]
  (let [active-route (rf/subscribe [:active-route])]
    [:<>
     (routeDefs @active-route props)]))
