import { getSprite } from '../../engine/asset-manager';

function convertRGB(r, g, b) {
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
  const [r, g, b] = [30, 160, 30].map(v => parseInt(Math.random() * 70, 10) + v);
  sprite.tint = convertRGB(r, g, b);
  return sprite;
}

function flatten(arr) {
  return arr.reduce((prev, curr) => prev.concat(curr));
}

function map2d(arr2d, func) {
  return arr2d.map((row, y) => row.map((val, x) => func(val, x, y)));
}

export default function createTiledMap(gameMap) {
  return flatten(map2d(gameMap, (v, x, y) => createTile(x, y)));
}
