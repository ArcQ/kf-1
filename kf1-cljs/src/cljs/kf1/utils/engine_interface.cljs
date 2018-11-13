(ns kf1.utils.engine-interface
  (:require [kfGameEngine]))

(def getSprite (goog.object/getValueByKeys kfGameEngine #js ["default" "assetManager" "getSprite"]))

(defn addChildToStage [sprite]
  ((goog.object/getValueByKeys kfGameEngine #js ["default" "app" "stage" "addChild"]) sprite))

(defn drawTargetCircle [pos]
  (let [graphics (-> (.-PIXI kfGameEngine)
                     (.-Graphics )
                     (Graphics.))]
    (.lineStyle graphics 2 0xFF00FF)
    (.drawCircle graphics 0 , 0 ,20)
    (setPos graphics pos)
    (prn (.-position graphics))
    (.endFill graphics)
    graphics))

(defn setPos [sprite, pos]
  (set! (.-x (.-position sprite)) (pos 0))
  (set! (.-y (.-position sprite)) (pos 1))
  (sprite))

