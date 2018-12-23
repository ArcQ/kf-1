(ns kf1.views.Game.scenes.level-one.event-listeners
  (:require [kfGameEngine]
            [oops.core :refer [oget oset! ocall!]]))
;; not done yet

(defn handleEvents [evt renderKeys & args] 
  (let [k ((vec args) 0)]
    (letfn [(wasmUpdate [arr] (prn arr) (if (not (nil? arr)) 
                                          (ocall! 
                                            kfGameEngine 
                                            "default.wasmUpdate" 
                                            (clj->js (concat [(get renderKeys k)] arr)))))] 
      (-> (case ((vec args) 0) 
            "MOVE" (ocall! 
                     kfGameEngine 
                     "default.utils.mapDOMPosToStage"
                     (array (oget evt "offsetX") (oget evt "offsetY")))
            "ATTACK" (-> (ocall! evt :stopPropagation))  
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
                (handleEvents evt renderKeys "ATTACK" 1)
                (ocall! evt :stopPropagation))
              false)))

