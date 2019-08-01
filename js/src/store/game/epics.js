import { constants as storeConstants } from '@kf/game-engine/es/store/ducks';
import { ofType } from 'redux-observable';
import { push } from 'react-router-redux';
import { map } from 'rxjs/operators';

export const sceneChangeEpic$ = action$ =>
  action$.pipe(
    ofType(storeConstants.PUSH_LOCATION),
    // filter(action => action.type === engine.utils.storeConstants.PUSH_LOCATION),
    map(({ payload }) => push(payload.path)),
  );

export default [
  sceneChangeEpic$,
];
