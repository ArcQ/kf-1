import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = {
  locationBeforeTransitions: null,
};

export default function routeReducer(state = initialState, action) {
  switch (action.type) {
      /* istanbul ignore next */
    case LOCATION_CHANGE:
      return {
        ...state,
        locationBeforeTransitions: action.payload,
      };
    default:
      return state;
  }
}
