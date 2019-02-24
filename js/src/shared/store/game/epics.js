import engine from 'kf-game-engine';
import { ofType } from 'redux-observable';
import { push } from 'react-router-redux';
import { map } from 'rxjs/operators';

export const sceneChangeEpic$ = action$ =>
  action$.pipe(
    ofType(engine.utils.storeConstants.PUSH_LOCATION),
    // filter(action => action.type === engine.utils.storeConstants.PUSH_LOCATION),
    map(({ payload }) => push(payload.path)),
  );

export default [
  sceneChangeEpic$,
];
