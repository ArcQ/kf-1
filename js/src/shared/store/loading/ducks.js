// vendor
import { LOCATION_CHANGE } from 'react-router-redux';
import engine from 'kf-game-engine';

export const selectors = {
  loadingPercentage: state => state.loading.percentage,
};

/*
 * Reducer
 */

const initialState = {
  percentage: 0,
  timesLoaded: 0,
};

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case engine.utils.storeConstants.SET_LOAD_PERCENTAGE:
      return {
        ...state,
        percentage: action.payload.percentage / (state.timesLoaded + 1),
      };
    case LOCATION_CHANGE:
      return (action.payload.state && action.payload.state.loadingScene)
        ? { ...state, timesLoaded: state.percentage / 100 }
        : state;
    default:
      return state;
  }
}
