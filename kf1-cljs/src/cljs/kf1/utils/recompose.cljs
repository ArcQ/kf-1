(ns kf1.utils.recompose)

(defn withRefHandlers [component] 
  (let [refs (atom {})]
    (letfn [(setRef [k com] 
              (swap! !ref merge {(keyword k) com}))
            (handleRef [k cb] 
              (cb ((keyword k) @refs)))] 
      (fn [props] 
        (component (merge props {:setRef setRef :handleRef handleRef}))))))

(defn lifecycle [classConfig] 
  (fn [component]
    (fn [props] 
      (reagent/create-class
        (merge classConfig {:reagent-render 
                            (component props)})))))
