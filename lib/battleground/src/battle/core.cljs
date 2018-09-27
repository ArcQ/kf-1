(ns battle.core
  (:require [utils.jsutils :as jsutils_lib])
  (:require [battle.update :as update_lib]))

(def COMMANDS {
               :MOVE "MOVE"
               :TARGET "TARGET"
               :USE_SKILL "USE_SKILL"
               })

(def config
  (atom { :use-own-state false }))

(def gameState
  (atom {}))

(defn start [_config initialGameState watchState]
  (add-watch gameState :watcher
             (fn [key atom oldState newState]
               (watchState @gameState)))
  (reset! config _config)
  (reset! gameState (js->clj initialGameState))
  @gameState)

(def jsutils jsutils_lib/jsutils)
(def getUpdate (update_lib/getUpdate gameState))
