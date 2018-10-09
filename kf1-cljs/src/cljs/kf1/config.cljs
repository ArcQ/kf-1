(ns kf1.config)

(def debug?
  ^boolean goog.DEBUG)

(def game
  {:assetUrl "https://s3.ca-central-1.amazonaws.com/dev-assets-1/"
   :defaultScene "levelOne"
   :aspectRatio {:x 9
                 :y 16}
   :disableResponsive false
   :FPS 30 })

