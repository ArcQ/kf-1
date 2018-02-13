// vendor
import createHelpers from 'utils/reduxHelpers';
import { LOCATION_CHANGE } from 'react-router-redux';

const namespace = 'app/auth';
const { createConstantsAndActions } = createHelpers(namespace);

const constArr = [
  'SET_LOAD_PERCENTAGE',
];

/**
 * Constants and Actions
 */

export const { constants, actions } = createConstantsAndActions(constArr);

/**
 * Selectors
 */

export const selectors = {
  loadingPercentage: state => state.loading.percentage,
};

/**
 * Reducer
 */

// The initial application state
const initialState = {
  // pixi.loader's percentage does not reset to 0 after every load, so need to keep track of this
  percentage: 0,
  timesLoaded: 0,
};

const c = constants;

// Takes care of changing the application state
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case c.SET_LOAD_PERCENTAGE:
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
