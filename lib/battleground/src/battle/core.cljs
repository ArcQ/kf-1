(ns battle.core
  (:require-macros [utils.macros :refer [log]])
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

(defn ^:export start [_config initialGameState watchState]
  (add-watch gameState :watcher
             (fn [key atom oldState newState]
               (prn "-- Atom Changed --")
               (.log js/console newState)
               (watchState @gameState)))
  (reset! config _config)
  (reset! gameState ( hash-map initialGameState))
  (log @gameState)
  updateF)
