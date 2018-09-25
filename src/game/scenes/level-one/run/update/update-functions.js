import { of } from 'rxjs';
import { fromJS } from 'immutable';
import {
  endWith, takeWhile, mergeMap, map,
} from 'rxjs/operators';
import { obsDictFactory } from 'game/engine/game-loop/update.utils';

import { move } from '../items/goblin';

const obsStore = {};

const RUNNING = 0;
const COMPLETE = 1;

export function moveCharF(charKey, inputDef, { framesAndEvents$, updateGame, gameState$ }) {
  const showCircle$ = of(updateGame(gameState => gameState
    .setIn(['moveTargetCircle', 'pos'], fromJS(inputDef.pos))
    .setIn(['moveTargetCircle', 'isShow'], true)));

  const moveChar = move(
    gameState$.getValue().get(charKey),
    inputDef.pos,
  );

  const updateNewCharPos = map(({ deltaTime }) => {
    const newPos = moveChar(gameState$.getValue().getIn([charKey, 'pos']), deltaTime);
    updateGame(gameState =>
      gameState.setIn([charKey, 'pos'], newPos));
    return { newPos };
  });

  const showCircleMoveChar$ = showCircle$.pipe(
    mergeMap(() => framesAndEvents$),
    updateNewCharPos,
    takeWhile(({ newPos }) => newPos.get(0) !== inputDef.pos[0]),
    map(() => RUNNING),
    endWith(COMPLETE),
  );

  if (obsStore.click) {
    obsStore.click.next(showCircleMoveChar$);
  } else {
    const obsDict = obsDictFactory(
      showCircleMoveChar$,
      'takeLatest',
    );
    obsDict.obs$.subscribe((v) => {
      if (v === COMPLETE) {
        updateGame(gameState => gameState
          .setIn(['moveTargetCircle', 'isShow'], false));
      }
    });
    obsStore.click = obsDict;
  }
}
