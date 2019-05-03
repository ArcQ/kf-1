import config from 'config.json';

import { assetManager } from 'kf-game-engine';
import { flatten, map2d } from 'utils/arrUtils';

import { getWWidth } from 'utils/global';

const GAMEMAP_TO_TEXTUE = [
  'grassTexture',
  'sandTexture',
  'waterTexture',
  'mountainTexture',
];

export const tileW = getWWidth() / config.game.mapSize.x;
export const tileH = getWWidth() / config.game.mapSize.y;

function convertRGB(r, g, b) {
  return 65536 * r + 256 * g + b;
}
function createTile(v, x, y) {
  const sprite = assetManager.getSprite('levelOne', GAMEMAP_TO_TEXTUE[v]);
  sprite.x = x * tileW;
  sprite.y = y * tileH;
  sprite.height = tileH;
  sprite.width = tileW;
  if (v === 0) {
    const [r, g, b] = [30, 160, 30].map(c => parseInt(Math.random() * 70, 10) + c);
    sprite.tint = convertRGB(r, g, b);
  }
  return sprite;
}

export default function createTiledMap(gameMap) {
  return flatten(map2d(gameMap, (v, x, y) => createTile(v, x, y)));
}
