(ns kf1.views.Game.scenes.level-one.event-listeners
  (:require [kfGameEngine]
            [oops.core :refer [oget oset! ocall!]]))
;; not done yet

(defn handleEvents [evt renderKeys & args] 
  (let [eventArgs (vec args)
        k (eventArgs 0)]
    (letfn [(wasmUpdate [arr] (ocall! 
                                kfGameEngine 
                                "default.wasmUpdate" 
                                (clj->js (concat [(get renderKeys k)] arr))))] 
      (-> (case k 
            "MOVE" (ocall! 
                     kfGameEngine 
                     "default.utils.mapDOMPosToStage"
                     (array (oget evt "offsetX") (oget evt "offsetY")))
            "SPOT_ATTACK" (do
                       (ocall! evt :preventDefault)
                       (array (eventArgs 1)))  
            ;; "SET_TARGET" (-> (ocall! 
            ;;                    kfGameEngine 
            ;;                    "default.utils.mapDOMPosToStage"
            ;;                    (array (oget evt "offsetX") (oget evt "offsetY")))
            ;;                  (constantly nil))
            )
        (wasmUpdate)))))

(defn watchEvents [renderKeys]
  (-> (ocall! js/document :getElementById "ui")
      (ocall! :addEventListener 
              "click" 
              (fn [evt] (handleEvents evt renderKeys "MOVE"))
              false))
  (-> (ocall! js/document :getElementById "attackOneBtn")
      (ocall! :addEventListener 
              "click" 
              (fn [evt] 
                (handleEvents evt renderKeys "SPOT_ATTACK" 1)
                (ocall! evt :stopPropagation))
              false)))

