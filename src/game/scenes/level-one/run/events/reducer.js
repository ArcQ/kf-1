import { of } from 'rxjs';
import { fromJS } from 'immutable';
import {
  combineLatest, takeWhile, mergeMap, tap, map,
} from 'rxjs/operators';
import { obsDictFactory } from 'game/engine/game-loop/update.utils';
import { move } from '../items/goblin';

export default function reducer({
  framesAndEvents$, updateGame, updateRender, gameState$,
}, inputDef) {
  switch (inputDef.type) {
    case 'click': {
      const showCircle$ = of(updateRender(renderState => renderState
        .setIn('targetCircle.pos', inputDef.pos)
        .setIn('targetCircle.isShow', true)));

      const hideCircle$ = of(updateRender(state => state
        .set('targetCircle.isShow', false)));

      const moveGoblin = move(
        gameState$.getValue().get('goblin'),
        inputDef.pos,
      );

      const updateNewGoblinPos = map(({ deltaTime }) => {
        const newPos = moveGoblin(deltaTime);
        updateGame(gameState =>
          gameState.updateIn(['goblin', 'pos'],
            (pos) => fromJS([pos[0] + newPos[0], pos[1] + newPos[1]])));
        updateRender(renderState => console.log(renderState.toJS()['goblin.pos']) ||
          renderState.update('goblin.pos', (pos) => console.log(pos) ||
          fromJS([pos[0] + newPos[0], pos[1] + newPos[1]])));

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
