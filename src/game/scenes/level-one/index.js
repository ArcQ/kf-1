import * as PIXI from 'pixi.js';

import request from 'utils/request';

import createTiledMap from './createTileMap';
import mainLoadingScene from '../loading/main';

function createGoblin() {
  const frames = Array(6).map((v, i) => PIXI.Texture.fromFrame(`1_GOBLIN_WALK_00${i}.png`));

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
      data => console.log(data),
      error => console.log('err:', error),
    );
  },
  onTick() {
  },
  onFinishLoad(stage) {
    const tileMap = createTiledMap();
    tileMap.map(tile => stage.addChild(tile));

    // create an array of textures from an image path
    const goblin = createGoblin();
    stage.addChild(goblin);
  },
};

function onAssetsLoaded() {
}
