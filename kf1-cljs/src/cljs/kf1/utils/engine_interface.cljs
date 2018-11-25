(ns kf1.utils.engine-interface
  (:require [kfGameEngine]
            [oops.core :refer [oget oset! ocall!]]))

(def getSprite (goog.object/getValueByKeys kfGameEngine #js ["default" "assetManager" "getSprite"]))

(defn addChildToStage [sprite]
  (ocall! kfGameEngine ["default" "app" "stage" "addChild"] sprite))

(defn setPos! [sprite, pos]
  (prn sprite pos)
  (doto sprite
    (oset! "x" (pos 0))
    (oset! "y" (pos 1))))

(defn drawTargetCircle [pos]
  (let [Graphics (-> (oget kfGameEngine "default.PIXI")
                     (.-Graphics))
        graphics (Graphics.)]
    (doto graphics 
      (.lineStyle 2 0xFF00FF)
      (.drawCircle 0 , 0 ,20)
      (setPos! pos)
      (.endFill ))))
