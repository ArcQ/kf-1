(ns kf1.utils.engine-interface
  (:require [kfGameEngine]))

(def getSprite (goog.object/getValueByKeys kfGameEngine #js ["default" "assetManager" "getSprite"]))
