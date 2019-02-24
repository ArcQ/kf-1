import { combineReducers } from 'redux';
import loading from 'shared/store/loading/ducks';
import game from 'shared/store/game/ducks';
import route from 'shared/store/route/ducks';
import levelOne from 'shared/store/level-one/ducks';

export default function createReducer() {
  return combineReducers({
    loading,
    game,
    levelOne,
    route,
  });
}
