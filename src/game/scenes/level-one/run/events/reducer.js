import { of } from 'rxjs';
import { fromJS } from 'immutable';
import {
  takeWhile, mergeMap, map,
} from 'rxjs/operators';
import { obsDictFactory } from 'game/engine/game-loop/update.utils';
import { movePointIm } from 'utils/immutable.utils';

import { move } from '../items/goblin';

export default function reducer({
  framesAndEvents$, updateGame, gameState$,
}, inputDef) {
  switch (inputDef.type) {
    case 'click': {
      // const showCircle$ = of(actions.showCircle({ pos: inputDef.pos }));
      // const hideCircle$ = of(actions.hideCircle());
      const showCircle$ = of(updateGame(gameState => gameState
        .setIn(['moveTargetCircle', 'pos'], fromJS(inputDef.pos))
        .setIn(['moveTargetCircle', 'isShow'], true)));

      const moveGoblin = move(
        gameState$.getValue().get('goblin'),
        inputDef.pos,
      );

      const updateNewGoblinPos = map(({ deltaTime }) => {
        const newPos = moveGoblin(gameState$.getValue().getIn(['goblin', 'pos']), deltaTime);
        updateGame(gameState =>
          gameState.setIn(['goblin', 'pos'], newPos));
        return { newPos };
      });

      const showCircleMoveGoblin$ = showCircle$.pipe(
        mergeMap(() => framesAndEvents$),
        updateNewGoblinPos,
        takeWhile(({ newPos }) => newPos.get(0) !== inputDef.pos[0]),
      );

      const obsDict = obsDictFactory(
        showCircleMoveGoblin$,
      );

      obsDict.obs.subscribe(
        () => undefined,
        () => undefined,
        () => updateGame(gameState => gameState
          .setIn(['moveTargetCircle', 'isShow'], false)),
      );
    }
    default:
      return undefined;
  }
}
