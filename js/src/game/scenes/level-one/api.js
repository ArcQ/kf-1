import request from 'utils/request';
import engine from 'kf-game-engine';
import { map } from 'rxjs/operators';
import { actions as levelOneActions } from 'shared/store/level-one/ducks';
import { TILE_SIZE } from './constants';

export function generateGameMap(store) {
  return () => request(
    '/gamemap/generate',
    {
      x: parseInt(engine.web.screen.bounds[0] / TILE_SIZE, 10),
      y: parseInt(engine.web.screen.bounds[1] / TILE_SIZE, 10),
    },
  ).pipe(map((res) => {
    store.dispatch(levelOneActions.setGameMap(res));
    return (res);
  }));
}

export default {};
