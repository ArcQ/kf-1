(ns kf1.config)

(def debug?
  ^boolean goog.DEBUG)

(def game
  {:game { :defaultScene "levelOne"
          :aspectRatio {:x 9
                        :y 16}
          :disableResponsive false
          :FPS 30
          }
   })
