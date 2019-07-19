import config from 'config.json';
import { getSprite } from '@kf/game-utils/dist/pixi/sprite';

import engine from '@kf/game-engine';
import {
  sum,
  divide,
  zipObj,
  mergeWith,
  memoizeWith,
} from 'ramda';
import { flatten, map2d } from 'utils/arrUtils';
import { getWWidth, getWHeight } from '@kf/game-utils/dist/render/global';

const GAMEMAP_TO_TEXTUE = [
  'grassTexture',
  'sandTexture',
  'waterTexture',
  'mountainTexture',
];

/**
 * getTileDims
 * returns {tileW, tileH} based on web.screen.bounds,
 * memoized by the window height and width summed up
 * or some key that will change when bounds change
 *
 *
 * @returns {undefined}
 */
export const getTileDims = memoizeWith(sum, () => {
  const dimensions = mergeWith(
    divide,
    zipObj(['x', 'y'], engine.web.screen.bounds),
    config.game.mapSize,
  );
  const { x: tileW, y: tileH } = dimensions;
  return { tileW, tileH };
});

function convertRGB(r, g, b) {
  return 65536 * r + 256 * g + b;
}

function createTile(v, x, y) {
  const sprite = getSprite('levelOne', GAMEMAP_TO_TEXTUE[v]);
  const { tileW, tileH } = getTileDims([getWHeight, getWWidth]);
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
