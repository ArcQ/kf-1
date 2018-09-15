(ns battle.core)

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

(defn ^:export start [_config initialGameState]
  ;; (reset! config _config)
  ;; (reset! gameState initialGameState)
  "ha")

(add-watch gameState :watcher
  (fn [key atom oldState newState]
    (prn "-- Atom Changed --")
    (.log js/console oldState)))
