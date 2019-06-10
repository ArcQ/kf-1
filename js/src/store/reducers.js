import { combineReducers } from 'redux';
import loading from 'store/loading/ducks';
import game from 'store/game/ducks';
import route from 'store/route/ducks';
import levelOne from 'store/level-one/ducks';

export default function createReducer() {
  return combineReducers({
    loading,
    game,
    levelOne,
    route,
  });
}
