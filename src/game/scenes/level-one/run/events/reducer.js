import { of } from 'rxjs';
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
        .setIn(['moveTargetCircle', 'pos'], inputDef.pos)
        .setIn(['moveTargetCircle', 'isShow'], true)));

      const hideCircle$ = of(updateGame(gameState => gameState
        .setIn(['targetCircle', 'isShow'], false)));

      const moveGoblin = move(
        gameState$.getValue().get('goblin'),
        inputDef.pos,
      );

      const updateNewGoblinPos = map(({ deltaTime }) => {
        const newPos = moveGoblin(deltaTime);
        updateGame(gameState =>
          gameState.updateIn(['goblin', 'pos'],
            pos => console.log(pos) || movePointIm(pos, newPos)));
        return newPos;
      });

      const showCircleMoveGoblin$ = showCircle$.pipe(
        mergeMap(() => framesAndEvents$),
        updateNewGoblinPos,
        takeWhile(({ newPos }) => newPos !== inputDef.pos),
        mergeMap(() => hideCircle$),
      );

      return obsDictFactory(
        showCircleMoveGoblin$,
      );
    }
    default:
      return undefined;
  }
}
