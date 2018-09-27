(ns battle.director.director_functions.moveChar
  (:require ["rxjs/operators" :refer (endWith takeWhile mergeMap) :rename {map rxMap}])
  (:require ["rxjs" :refer (of)]))

(defn move [traits, destination]
  "returns a function that incrementally moves a character based on dt"
  (let [diff (vec (map - destination (get traits "pos")))
        signs (map Math/sign destination)
        normalized (map 
                     #(/ (diff 0) (Math/abs (diff 0))) 
                     [0, 0])
        rad (Math/atan (/ (diff 1) (diff 0)))
        multipliers [(Math/cos rad) (Math/sin rad)]]
    (letfn [(pastDestination? [_nextPt] 
              (->> (map #(-> (- %1 %2)
                             (Math/sign)
                             (not= %3)) 
                        destination _nextPt signs)
                   (reduce #((or %2 %1)) false)))]
      (fn moveOnNext [curPos, dt]
        (let [dist (:speed (* traits dt 5))
              moveDiff (map * multipliers normalized [dist dist])
              nextPt (map + curPos moveDiff)]
          (if (pastDestination? nextPt) 
            destination 
            nextPt))))))

(defn runMoveOnNext [{ dt :dt}]
  (let [newPos 
        (moveOnNext (get (getTraits) "pos") dt)] 
    (swap! gameState update-in [charKey "pos"] newPos)))

(defn moveChar [charKey, gameState, framesAndEvents$ dt, destination]
  ;; (js/console.log @gameState)
  (letfn [(getTraits [] (get @gameState charKey))]
    (let [moveOnNext (move (getTraits) destination)
          updateNewCharPos (rxMap runMoveOnNext)]

      )))
