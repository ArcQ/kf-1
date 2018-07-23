import * as PIXI from 'pixi.js';

import request from 'utils/request';
import { getSprite } from 'game/engine/asset-manager';
import mainLoadingScene from '../loading/main';

function createTile() {
  const sprite = getSprite('levelOne', 'grassTexture');
  sprite.x = 100;
  sprite.y = 100;
  sprite.height = 100;
  sprite.width = 100;
  return sprite;
}

function createGoblin() {
  const frames = [];

  for (let i = 0; i < 6; i++) {
    frames.push(PIXI.Texture.fromFrame(`1_GOBLIN_WALK_00${i}.png`));
  }

  // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
  const anim = new PIXI.extras.AnimatedSprite(frames);

  /*
   * An AnimatedSprite inherits all the properties of a PIXI sprite
   * so you can change its position, its anchor, mask it, etc
   */
  anim.x = 200;
  anim.y = 200;
  anim.height = 100;
  anim.width = 100;
  anim.anchor.set(0.5);
  anim.animationSpeed = 0.3;
  anim.play();
  return anim;
}

export default {
  name: 'level-one-scene',
  loading: mainLoadingScene,
  uiRoute: '/level-one',
  assets: ['levelOne', 'goblins'],
  willLoad() {
    request('/gamemap/generate').subscribe(
      (data) => console.log(data),
    );
  },
  onTick() {
    // anim.rotation += 0.01;
  },
  onFinishLoad(stage) {
    // create an array of textures from an image path
    const goblin = createGoblin();
    stage.addChild(goblin);

    const tile = createTile();
    stage.addChild(tile);
  },
};

function onAssetsLoaded() {
}
