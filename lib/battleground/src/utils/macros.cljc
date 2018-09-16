(ns utils.macros)

(defmacro log
  [& msgs]
  `(.log js/console ~@msgs))
