(ns kf1.views.Game.scenes.level-one.event-sources
  (:require [kfGameEngine :as engine]
            [oops.core :refer [oget oset! ocall!]]))
;; not done yet

(def EVENT_CLICK "click")

(def eventsMap 
  (clj->js { EVENT_CLICK 
            (fn [injectKAndCallRust] 
              (-> (ocall! js/document :getElementById "mainGameContainer")
                  (ocall! :addEventListener 
                          EVENT_CLICK 
                          (fn [evt] (injectKAndCallRust 
                                      (fn []
                                        (ocall! 
                                          kfGameEngine 
                                          "default.utils.mapDOMPosToStage"
                                          (array (oget evt "offsetX") (oget evt "offsetY"))))))
                          false)))}))
