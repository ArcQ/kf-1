(ns utils.jsutils)

(def jsutils
  (js-obj 
    "getIn" (fn [cljsSeq args] (get-in cljsSeq (js->clj args)))))
