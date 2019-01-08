(ns kf1.views.game.scenes.level-one.render
  (:require [kfGameEngine :as engine]
            [oops.core :refer [oset! ocall! oget]]
            [goog.string :as gstring]
            [kf1.views.Game.scenes.level-one.api :refer [nonUiState]]
            [kf1.views.game.scenes.level-one.items.characters :refer [charactersDict]]
            [kf1.views.Game.scenes.level-one.event-listeners :refer [handleEvents]]
            [kf1.utils.engine-interface :refer [drawTargetCircle setPos! addChildToStage getSprite]]))

(def RENDER_KEYS (atom []))

(def TILE_SIZE 60)

(def GAMEMAP_TO_TEXTURE [
                         "grassTexture",
                         "sandTexture",
                         "waterTexture",
                         "mountainTexture",
                         ])

(def spriteStore (atom {}))

(defn createTile [v, x, y]
  (doto (getSprite "levelOne" (GAMEMAP_TO_TEXTURE v))
    (oset! :x (* x TILE_SIZE))
    (oset! :y (* y TILE_SIZE))
    (oset! :width TILE_SIZE)
    (oset! :height TILE_SIZE)))

(defn createTileMap [gameMap]
  (-> (fn [y row]  (map-indexed (fn [x v] (createTile v x y)) row))
      (map-indexed gameMap)
      (flatten)))

(defn initialRender []
  (let [initialPos {:goblin [100 100] :assasin [200 200] :moveTargetCircle [0 0]}
        gameMap (:gameMap @nonUiState)
        tileMap (doall (->> (createTileMap gameMap)
                            (map #(addChildToStage %1))))]
    (letfn [(charKeysReducer [acc k] 
              (let [sprite ((:sprite (get charactersDict k)) 
                            (k initialPos))]
                (addChildToStage sprite)
                (merge acc {k sprite})))]
      (let [sprites (->> [:goblin :assasin]
                         (reduce charKeysReducer {}))
            moveTargetCircle (drawTargetCircle (:moveTargetCircle initialPos))]
        (oset! moveTargetCircle :visible false)
        (addChildToStage moveTargetCircle)
        (swap! spriteStore merge sprites {:moveTargetCircle moveTargetCircle})))))

;; reduce #(split) {cur dict} [restbytes]
(defn setSpritePos! [nextPosState]
  (let [jsPos (-> (ocall! nextPosState :slice -2))
        pos [(aget jsPos 0) (aget jsPos 1)]]
    (condp = (aget nextPosState 0)
      (.indexOf @RENDER_KEYS "TARGET_CIRCLE") (doto (:moveTargetCircle @spriteStore)
                                                    (setPos! pos)
                                                    (oset! :visible true))
      (.indexOf @RENDER_KEYS "P1") (doto (:assasin @spriteStore)
                                              (setPos! pos))
      )))

(defn runAnimOnSprite [sprite charState]
  (prn "hi")
  (letfn [(onComplete []
            (prn "FINISH_SPOT_ATTACK")
            (condp = charState
              (.indexOf @RENDER_KEYS "SPOT_ATTACK") (handleEvents nil @RENDER_KEYS "FINISH_SPOT_ATTACK" "P1"))
            )]
    (let [frames (condp = charState 
                   (.indexOf @RENDER_KEYS "IDLE") (->> (range 5)
                                                       (map-indexed 
                                                         (fn [_ i] (ocall! 
                                                                     engine 
                                                                     "default.PIXI.Texture.fromFrame"
                                                                     (gstring/format "1_IDLE_00%dassasin.png" i)))))
                   (.indexOf @RENDER_KEYS "MOVE") (->> (range 5)
                                                       (map-indexed 
                                                         (fn [_ i] (ocall! 
                                                                     engine 
                                                                     "default.PIXI.Texture.fromFrame"
                                                                     (gstring/format "2_WALK_00%dassasin.png" i)))))
                   (.indexOf @RENDER_KEYS "SPOT_ATTACK") (->> (range 9)
                                                              (remove odd?)
                                                              (map-indexed 
                                                                (fn [_ i] (ocall! 
                                                                            engine 
                                                                            "default.PIXI.Texture.fromFrame"
                                                                            (gstring/format "6_ATTACK2_00%dassasin.png" i)))))) 
          AnimatedSprite (oget
                           engine 
                           "default.PIXI.extras.AnimatedSprite")]
      (doto (:assasin @spriteStore)
        (ocall! :stop)
        (oset! :textures (clj->js frames))
        ((fn [sprite] (if (= charState (.indexOf @RENDER_KEYS "MOVE")) 
                        (oset! sprite :loop false) 
                        (oset! sprite :loop true))))
        ((fn [sprite] (if (= charState (.indexOf @RENDER_KEYS "SPOT_ATTACK")) 
                        (oset! sprite :loop false) 
                        (oset! sprite :loop true))))
        ((fn [sprite] (if (not (nil? onComplete)) (oset! sprite :onComplete onComplete))))
        (ocall! :play)))))

(defn setSpriteCharState [nextPosState]
  (condp = (aget nextPosState 0)
    (.indexOf @RENDER_KEYS "P1") (runAnimOnSprite (:assasin @spriteStore) (aget nextPosState 1))))

(defn abs [n] (max n (- n)))

(defn setSpriteOrientation [nextOrientationState]
  (condp = (aget nextOrientationState 0)
    (.indexOf @RENDER_KEYS "P1")  (->>
                                    (if (= (aget nextOrientationState 1) 2) 
                                      -1 1)
                                    (* (abs (oget (:assasin @spriteStore) [:scale :x])))
                                    (oset! (:assasin @spriteStore) [:scale :x]))))

(defn handleSubState [subState]
  (let [subStateLen (aget subState 0)
        k (aget subState 1)
        data (ocall! subState :slice 2)]
    (condp = k
      (.indexOf @RENDER_KEYS "SET_SPRITE_POS") (setSpritePos! data)
      (.indexOf @RENDER_KEYS "SET_CHAR_STATE") (setSpriteCharState data)
      (.indexOf @RENDER_KEYS "CHANGE_ORIENTATION") (setSpriteOrientation data)
      ))
  )

(defn decodeByteArray [gameStateByteArray]
  (loop [i 1]
    (when (< i (aget gameStateByteArray 0))
      (let [subStateLen (aget gameStateByteArray i)
            subStateEndI (+ i subStateLen)]
        (handleSubState (ocall! gameStateByteArray :slice i subStateEndI))
        (recur subStateEndI)))))

(defn tick [renderKeys]
  (swap! RENDER_KEYS concat renderKeys)
  (fn [gameStateByteArray] 
    (if (not (nil? gameStateByteArray))
      (decodeByteArray gameStateByteArray))))
