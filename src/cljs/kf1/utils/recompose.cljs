(ns kf1.utils.recompose
  (:require [reagent.core :as reagent]))

(defn withRefHandlers [component] 
  (let [refs (atom {})]
    (letfn [(setRef [k com] 
              (swap! refs assoc (keyword k) com))
            (handleRef [k cb] 
              (-> (get @refs (keyword k))
                  ((fn [kRef] (if kRef 
                                (cb kRef))))))] 
      (fn [props] 
        (component (merge props {:setRef setRef :handleRef handleRef}))))))

(defn lifecycle [classConfig] 
  (letfn [(wrapInProps [_props _classConfig] 
            (reduce-kv 
              (fn [prev k v] 
                (assoc prev k (fn [component] (v component _props)))) 
              {} _classConfig))] 
    (fn [component]
      (fn [props] 
        (reagent/create-class
          (merge (wrapInProps props classConfig) 
                 {:reagent-render (fn [] (component props))}))))))
