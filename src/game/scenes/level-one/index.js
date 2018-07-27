import * as PIXI from 'pixi.js';

import request from 'utils/request';
import { getSprite } from 'game/engine/asset-manager';
import mainLoadingScene from '../loading/main';

function convertRGB(r,g,b) {
  return 65536 * r + 256 * g + b;
}

function createTile(x, y) {
  const sprite = getSprite('levelOne', 'grassTexture');
  sprite.x = x * 60;
  sprite.y = y * 60;
  sprite.height = 60;
  sprite.width = 60;
  // sprite.tint = Math.random() * 0xFFFFFF;
  // const [r,g,b] = [30, 160, 30].map((v) => Math.random(1) + v);
  // sprite.tint = convertRGB(r,g,b);
  const [r,g,b] = [30, 160, 30].map((v) => parseInt(Math.random() * 70) + v);
  sprite.tint = convertRGB(r,g,b);
  return sprite;
}

function flatten(arr) {
  return arr.reduce((prev, curr) => prev.concat(curr))
}

function createTiledMap() {
  const arr1d = Array(20).fill().map((e,y) => y);
  const arr2d = arr1d
    .map((y) => Array(10).fill().map((e,x)=> ({ x, y })))
  return flatten(arr2d)
    .map(({x, y}) => createTile(x, y));
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
      (error) => console.log('err:', error),
    );
  },
  onTick() {
  },
  onFinishLoad(stage) {

    const tileMap = createTiledMap();
    tileMap.map((tile) => stage.addChild(tile));

    // create an array of textures from an image path
    const goblin = createGoblin();
    stage.addChild(goblin);

  },
};

function onAssetsLoaded() {
}
