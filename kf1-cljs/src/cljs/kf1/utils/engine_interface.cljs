(ns kf1.utils.engine-interface
  (:require [kfGameEngine]))

(def getSprite (goog.object/getValueByKeys kfGameEngine #js ["default" "assetManager" "getSprite"]))

(defn addChildToStage [sprite]
  ((goog.object/getValueByKeys kfGameEngine #js ["default" "app" "stage" "addChild"]) sprite))

(defn drawTargetCircle [pos]
  (let [graphics (-> (.-PIXI kfGameEngine)
                     (.-Graphics )
                     (Graphics.))]
    (doto graphics 
      (.lineStyle 2 0xFF00FF)
      (.drawCircle 0 , 0 ,20)
      (setPos pos)
      (.endFill ))))

(defn setPos [sprite, pos]
  (doto sprite
    (goog.object/set "x" (pos 0))
    (goog.object/set "y" (pos 1))))

