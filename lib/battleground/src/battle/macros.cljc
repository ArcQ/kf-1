(ns battle.macros)

(defmacro log
  [& msgs]
  `(.log js/console ~@msgs))
