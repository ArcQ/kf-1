import createHelpers from 'utils/reduxHelpers';
import { fromJS } from 'immutable';

const namespace = 'level-one';
const { createConstantsAndActions } = createHelpers(namespace);

const constArr = [
  'SHOW_CIRCLE',
  'HIDE_CIRCLE',
];

export const { constants, actions } = createConstantsAndActions(constArr);

export const selectors = {};

const initialState = fromJS({
  goblin: {
    isShow: false,
    pos: [200, 200],
  },
  moveTargetCircle: {
    isShow: false,
    pos: [100, 100],
  },
});

const c = constants;

export default function levelOneGameRedcuer(state = initialState, action) {
  switch (action.type) {
    case c.SHOW_CIRCLE:
      return gameState => gameState
        .setIn(['targetCircle', 'pos'], action.payload.pos)
        .setIn(['targetCircle', 'isShow'], true);
    case c.HIDE_CIRCLE:
      return state
        .setIn(['targetCircle', 'isShow'], false);
    default:
      return state;
  }
}
