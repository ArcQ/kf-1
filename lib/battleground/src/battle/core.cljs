(ns battle.core
  (:require-macros [utils.macros :refer [log]])
  (:require [utils.jsutils :as jsutils_lib])
  (:require [battle.update :refer [updateF]]))

(def COMMANDS {
               :MOVE "MOVE"
               :TARGET "TARGET"
               :USE_SKILL "USE_SKILL"
               })

(def config
  (atom
    { :use-own-state false }))

(def gameState
  (atom
    { :cuddle-hunger-level 0 }))

(defn start [_config initialGameState watchState]
  (add-watch gameState :watcher
             (fn [key atom oldState newState]
               (prn "-- Atom Changed --")
               (.log js/console newState)
               (watchState @gameState)))
  (reset! config _config)
  (reset! gameState (js->clj initialGameState))
  @gameState)

(def jsutils jsutils_lib/jsutils)