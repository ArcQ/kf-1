(ns kf1.views.ui.core
  (:require
    [re-frame.core :as rf]
    [kf1.views.ui.routes.level-one.view]
    [kf1.views.ui.routes.main-loading-page.view]
    [kf1.views.ui.routes.main-menu.view]))

(defmulti routes identity)
(defmethod routes :home [] [MainLoadingScene])
(defmethod routes :level-one [] [MainMenu])
(defmethod routes :main-loading-page [] [MainLoadingPage])
(defmethod routes :default [] [:div])

(defn view [props]
  (let [active-route (rf/subscribe [:active-route])]
    [:<>
     (routes @active-route)]))
