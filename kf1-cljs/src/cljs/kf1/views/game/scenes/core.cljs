(ns kf1.views.Game.scenes.core
  (:require [kf1.views.Game.scenes.level_one :refer [getLevelOne]]))

(def sceneDict { level: getLevelOne })
