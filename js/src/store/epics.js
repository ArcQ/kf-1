import { combineEpics } from 'redux-observable';

import gameEpics from 'store/game/epics';

export default combineEpics(
  ...gameEpics,
);
