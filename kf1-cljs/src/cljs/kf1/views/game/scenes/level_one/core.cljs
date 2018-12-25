(ns kf1.views.game.scenes.level-one.core
  (:require [kf1.views.Game.scenes.level-one.api :as api]
            [kf1.views.game.scenes.loading.main :as mainLoadingScene]
            [kf1.views.Game.scenes.level-one.event-listeners :as eventListeners]
            [kf1.views.game.scenes.level-one.render :as render]))

(def encoderKeys { 
                 "MOVE" 0 
                 "JUMP" 1 
                 "SPOT_ATTACK" 2 
                 "KEY_GOBLIN" 3
                 "KEY_ASSASIN" 4
                 "KEY_TARGET_CIRCLE" 5
                 "KEY_SET_SPRITE_POS" 6})

(defn getLevelOne []
  (clj->js {:name "level-one-scene"
            :encoderKeys encoderKeys
            :loading mainLoadingScene/getSceneObj
            :uiRoute "/level-one"
            :assets ["chars" "levelOne"]
            :willLoad api/generateGameMap
            :start (fn [] 
                                (render/initialRender)
                                (eventListeners/watchEvents encoderKeys))
            :update (render/tick encoderKeys)
            }))
