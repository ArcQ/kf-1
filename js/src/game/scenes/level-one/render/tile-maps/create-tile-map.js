import { assetManager } from 'kf-game-engine';
import { flatten, map2d } from 'utils/arrUtils';
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
  const sprite = assetManager.getSprite('levelOne', GAMEMAP_TO_TEXTUE[v]);
  sprite.x = x * TILE_SIZE;
  sprite.y = y * TILE_SIZE;
  sprite.height = TILE_SIZE;
  sprite.width = TILE_SIZE;
  // sprite.tint = Math.random() * 0xFFFFFF;
  // const [r,g,b] = [30, 160, 30].map((v) => Math.random(1) + v);
  // sprite.tint = convertRGB(r,g,b);
  if (v === 0) {
    const [r, g, b] = [30, 160, 30].map(c => parseInt(Math.random() * 70, 10) + c);
    sprite.tint = convertRGB(r, g, b);
  }
  return sprite;
}

export default function createTiledMap(gameMap) {
  return flatten(map2d(gameMap, (v, x, y) => createTile(v, x, y)));
}
