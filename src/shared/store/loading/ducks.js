// vendor
import createHelpers from 'utils/reduxHelpers';

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

export const selectors = {};

/**
 * Reducer
 */

// The initial application state
const initialState = {};

const c = constants;

// Takes care of changing the application state
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case c.SET_LOAD_PERCENTAGE:
      return initialState
        .setIn([action.payload.key], action.payload.percentage);
    default:
      return state;
  }
}
