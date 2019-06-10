import request from 'utils/request';
import config from 'config.json';
import { map } from 'rxjs/operators';
import { actions as levelOneActions } from 'store/level-one/ducks';

export function generateGameMap(store) {
  return () => request(
    '/gamemap/generate',
    config.game.mapSize,
  ).pipe(map((res) => {
    store.dispatch(levelOneActions.setGameMap(res));
    return { map: { matrix: res.gameMap } };
  }));
}

export default {};
