import createHelpers from 'utils/reduxHelpers';

const namespace = 'level-one';
const { createConstantsAndActions } = createHelpers(namespace);

const constArr = [
  'SET_GAME_MAP',
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
  gameMap: null,
};

const c = constants;

export default function levelOneReducer(state = initialState, action) {
  switch (action.type) {
    case c.SET_GAME_MAP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
