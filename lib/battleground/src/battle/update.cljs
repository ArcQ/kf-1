(ns battle.update
  (:require [battle.director.core :as director]))

(defn getStartEndF [startEndF inputType] 
  (letfn [(getFromJs [k] (goog.object/getValueByKeys startEndF #js [inputType k]))]
    {:start (let [start (getFromJs "start")] 
              (if (not (nil? start))
                start identity))
     :end (let [end (getFromJs "end")] 
            (if (not (nil? end))
              end identity))}))

(defn getUpdate [gameState]
  (fn [jsStartEndFs] 
    (fn [framesAndEvents$ dt inputState] 
      (if (> (.-length inputState) 0) 
        (goog.object/map inputState 
                                #(let [startEndF (getStartEndF 
                                                   jsStartEndFs 
                                                   (goog.object/getValueByKeys %1 #js ["type"]))]
                                   (director/control 
                                     gameState
                                     framesAndEvents$ 
                                     dt 
                                     %1 
                                     startEndF)))))))
