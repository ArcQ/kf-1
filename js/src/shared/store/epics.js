import { combineEpics } from 'redux-observable';

import gameEpics from 'shared/store/game/epics';

export default combineEpics(
  ...gameEpics,
);
