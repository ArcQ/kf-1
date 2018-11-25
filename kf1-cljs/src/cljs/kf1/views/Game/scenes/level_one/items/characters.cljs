(ns kf1.views.game.scenes.level-one.items.characters
  (:require [kfGameEngine :as engine]
            [oops.core :refer [oget oset! ocall!]]
            [goog.string :as gstring]
            [goog.string.format]
            [kf1.utils.engine-interface :refer [setPos!]]))

(def goblin
  {:create 
   (fn [pos]
     {:sprite "" :speed 10 :pos pos})
   :sprite
   (fn sprite [pos]
     (let [frames (->> (range 6)
                       (map-indexed 
                         (fn [_ i] (ocall! 
                                     engine 
                                     "default.PIXI.Texture.fromFrame"
                                     (gstring/format "1_GOBLIN_WALK_00%d.png" i)))))
           AnimatedSprite (oget
                            engine 
                            "default.PIXI.extras.AnimatedSprite")
           anim (AnimatedSprite. (clj->js frames))]
       (doto anim 
         (oset! "height" 100)
         (oset! "width" 100)
         (setPos! pos)
         (ocall! ["anchor" "set"] 0.5)
         (oset! "animationSpeed" 0.3)
         (ocall! "play"))))})


(def demon
  {:create 
   (fn [pos]
     { :sprite "" :speed 10 :pos pos})
   :sprite
   (fn sprite [pos]
     (let [frames (->> (range 6)
                       (map-indexed 
                         (fn [_ i] (ocall! 
                                     engine 
                                     "default.PIXI.Texture.fromFrame"
                                     (gstring/format "1_GOBLIN_WALK_00%d.png" i)))))
           AnimatedSprite (oget
                            engine 
                            "default.PIXI.extras.AnimatedSprite")
           anim (AnimatedSprite. (clj->js frames))]
       (doto anim 
         (oset! "height" 100)
         (oset! "width" 100)
         (setPos! pos)
         (ocall! ["anchor" "set"] 0.5)
         (oset! "animationSpeed" 0.3)
         (ocall! "play"))))})

(def wizard
  {:create 
   (fn [pos]
     { :sprite "" :speed 10 :pos pos})
   :sprite
   (fn sprite [pos]
     (let [frames (->> (repeat 6 0)
                       (map-indexed 
                         (fn [_ i] (ocall! 
                                     engine 
                                     "default.PIXI.Texture.fromFrame"
                                     (gstring/format "1_GOBLIN_WALK_00%d.png" i)))))
           AnimatedSprite (oget
                            engine 
                            "default.PIXI.extras.AnimatedSprite")
           anim (AnimatedSprite. (clj->js frames))]
       (doto anim 
         (oset! "height" 100)
         (oset! "width" 100)
         (setPos! pos)
         (ocall! ["anchor" "set"] 0.5)
         (oset! "animationSpeed" 0.3)
         (ocall! "play"))))})

(def assasin
  {:create 
   (fn [pos]
     { :sprite "" :speed 10 :pos pos})
   :sprite
   (fn sprite [pos]
     (let [frames (->> (range 5)
                       (map-indexed 
                         (fn [_ i] (ocall! 
                                     engine 
                                     "default.PIXI.Texture.fromFrame"
                                     (gstring/format "2_WALK_00%dassasin.png" i)))))
           AnimatedSprite (oget
                            engine 
                            "default.PIXI.extras.AnimatedSprite")
           anim (AnimatedSprite. (clj->js frames))]
       (doto anim 
         (oset! "height" 100)
         (oset! "width" 100)
         (setPos! pos)
         (ocall! ["anchor" "set"] 0.5)
         (oset! "animationSpeed" 0.3)
         (ocall! "play"))))})

(def charactersDict {:goblin goblin
                     :demon demon
                     :wizard wizard
                     :assasin assasin })
