import { getSprite } from 'game/engine/asset-manager';
import { TILE_SIZE } from '../../constants';

const GAMEMAP_TO_TEXTUE = [
  'grassTexture',
  'sandTexture',
  'waterTexture',
  'mountainTexture',
];

function convertRGB(r, g, b) {
  return 65536 * r + 256 * g + b;
}

function createTile(v, x, y) {
  const sprite = getSprite('levelOne', GAMEMAP_TO_TEXTUE[v]);
  sprite.x = x * TILE_SIZE;
  sprite.y = y * TILE_SIZE;
  sprite.height = TILE_SIZE;
  sprite.width = TILE_SIZE;
  // sprite.tint = Math.random() * 0xFFFFFF;
  // const [r,g,b] = [30, 160, 30].map((v) => Math.random(1) + v);
  // sprite.tint = convertRGB(r,g,b);
  if (v === 0) {
    const [r, g, b] = [30, 160, 30].map(v => parseInt(Math.random() * 70, 10) + v);
    sprite.tint = convertRGB(r, g, b);
  }
  return sprite;
}

function flatten(arr) {
  return arr.reduce((prev, curr) => prev.concat(curr));
}

function map2d(arr2d, func) {
  return arr2d.map((row, y) => row.map((val, x) => func(val, x, y)));
}

export default function createTiledMap(gameMap) {
  return flatten(map2d(gameMap, (v, x, y) => createTile(v, x, y)));
}
