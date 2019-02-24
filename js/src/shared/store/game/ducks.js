import createHelpers from 'utils/reduxHelpers';
import { LOCATION_CHANGE } from 'react-router-redux';

const namespace = 'game';
const { createConstantsAndActions } = createHelpers(namespace);

const constArr = [
  'SET_PAUSED',
];


/*
 * Constants and Actions
 */

export const { constants, actions } = createConstantsAndActions(constArr);

/*
 * Selectors
 */

export const selectors = {
  isPaused: state => state.game.isPaused,
};

/*
 * Reducer
 */

const initialState = {
  isPaused: false,
};

const c = constants;

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case c.SET_PAUSED:
      return { state, isPaused: action.payload.isPaused };
    case LOCATION_CHANGE:
      return {
        ...state,
        isPaused: action.payload.state && action.payload.state.isPaused,
      };
    default:
      return state;
  }
}
