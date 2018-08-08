import request from 'utils/request';
import engine from 'game/engine';
import { TILE_SIZE } from '../run/constants';

export function generateGameMap() {
  return request(
    '/gamemap/generate',
    {
      x: parseInt(engine.web.screen.bounds[0] / TILE_SIZE, 10),
      y: parseInt(engine.web.screen.bounds[1] / TILE_SIZE, 10),
    },
  );
}

export default {};
