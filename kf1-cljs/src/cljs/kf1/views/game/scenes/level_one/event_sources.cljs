(ns kf1.views.Game.scenes.level-one.event-sources
  (:require [kfGameEngine :as engine]
            [oops.core :refer [oget oset! ocall!]]))
;; not done yet

(defn getEventsMap [renderKeys] 
  (clj->js { "MOVE" 
            (fn [injectKAndCallRust] 
              (-> (ocall! js/document :getElementById "ui")
                  (ocall! :addEventListener 
                          "click" 
                          (fn [evt] (prn "click") 
                            (injectKAndCallRust 
                              (fn []
                                (ocall! 
                                  kfGameEngine 
                                  "default.utils.mapDOMPosToStage"
                                  (array (oget evt "offsetX") (oget evt "offsetY"))))))
                          false)))
            "ATTACK" 
            (fn [injectKAndCallRust] 
                (-> 
                         (ocall! js/document :getElementById "attackOneBtn")
                         (ocall! :addEventListener 
                                 "click" 
                                 (fn [evt] (prn "attackOne") 
                                   ;; (injectKAndCallRust 
                                   ;;   (fn []
                                   ;;     (ocall! 
                                   ;;       kfGameEngine 
                                   ;;       "default.utils.mapDOMPosToStage"
                                   ;;       (array "ATTACK_ONE"))))
                                   false))) ) 
            ;; "SET_TARGET"
            ;; (fn [injectKAndCallRust] 
            ;;   (-> (ocall! js/document :getElementById "setTargetBtn")
            ;;       (ocall! :addEventListener 
            ;;               "click" 
            ;;               (fn [evt] (prn "setTarget") (injectKAndCallRust 
            ;;                           (fn []
            ;;                             (ocall! 
            ;;                               kfGameEngine 
            ;;                               "default.utils.mapDOMPosToStage"
            ;;                               (array "SET_TARGET"))))
            ;;                 false))))
            }))
