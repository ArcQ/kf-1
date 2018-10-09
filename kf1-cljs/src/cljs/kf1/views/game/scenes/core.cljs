(ns kf1.views.Game.scenes.core
  (:require [kf1.views.game.scenes.level-one.core :refer [getLevelOne]]))

(def sceneDict { :levelOne getLevelOne })
