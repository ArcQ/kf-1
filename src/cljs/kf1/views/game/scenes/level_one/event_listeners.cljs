(ns kf1.views.Game.scenes.level-one.event-listeners
  (:require [kfGameEngine]
            [oops.core :refer [oget oset! ocall!]]))
;; not done yet

(def charHeight 42)

(defn handleEvents [evt encode & args] 
  (let [eventArgs (vec args)
        k (eventArgs 0)
        entityKey (encode "P1")]
    (letfn [(wasmUpdate [arr] (ocall! 
                                kfGameEngine 
                                "default.wasmUpdate" 
                                (clj->js (concat [(encode k)] arr))))] 
      (-> (case k 
            "MOVE" (->> (ocall! 
                          kfGameEngine 
                          "default.utils.mapDOMPosToStage"
                          (array (oget evt "offsetX") (- (oget evt "offsetY") (/ charHeight 2))))
                        (ocall! (array entityKey) :concat ))
            "SPOT_ATTACK" (do
                            (ocall! evt :preventDefault)
                            (array entityKey (eventArgs 1)))  
            "FINISH_SPOT_ATTACK" (do 
                                   (array entityKey (eventArgs 1)))  
            ;; "SET_TARGET" (-> (ocall! 
            ;;                    kfGameEngine 
            ;;                    "default.utils.mapDOMPosToStage"
            ;;                    (array (oget evt "offsetX") (oget evt "offsetY")))
            ;;                  (constantly nil))
            )
        (wasmUpdate)))))

(defn watchEvents [encode]
  (-> (ocall! js/document :getElementById "ui")
      (ocall! :addEventListener 
              "click" 
              (fn [evt] (handleEvents evt encode "MOVE"))
              false))
  (-> (ocall! js/document :getElementById "attackOneBtn")
      (ocall! :addEventListener 
              "click" 
              (fn [evt] 
                (handleEvents evt encode "SPOT_ATTACK" 1)
                (ocall! evt :stopPropagation))
              false)))

