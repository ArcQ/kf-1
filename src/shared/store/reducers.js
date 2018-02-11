import { combineReducers } from 'redux';
import loading from 'shared/store/loading/ducks';
import route from 'shared/store/route/ducks';

export default function createReducer() {
  return combineReducers({
    loading,
    route,
  });
}
