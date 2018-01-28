import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import loading from 'core/shared/store/loading/ducks';

const routeInitialState = {
  locationBeforeTransitions: null,
};

function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
      /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

export default function createReducer() {
  return combineReducers({
    loading,
    route: routeReducer,
  });
}
