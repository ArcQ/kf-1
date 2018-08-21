import { of } from 'rxjs';
import {
  combineLatest, takeWhile, mergeMap, map, tap, flatMap,
} from 'rxjs/operators';
import { obsDictFactory } from 'game/engine/game-loop/update.utils';
import { move } from '../items/goblin';

export default function reducer({
  framesAndEvents$, updateGame, updateRender, gameState$
}, inputDef) {
  console.log(gameState$.getValue());
  switch (inputDef.type) {
    case 'click': {
      const moveGoblin = move(
        gameState$.getValue().get('goblin'),
        inputDef.pos,
      );
      console.log(arguments);
      const showCircleMoveGoblin$ = of(
        updateGame(gameState => gameState
          .update(['goblin', 'pos'], goblin => goblin
            .set('pos', move(goblin.get('pos'), inputDef.pos)))),
      ).pipe(
        tap((gameState) => updateRender(renderState => console.log(renderState) || renderState
          .setIn(['goblin.pos'], inputDef.pos)
          .setIn('targetCircle.pos', inputDef.pos)
          .setIn('targetCircle.isShow', true))),
      );

      const hideCircle$ = of(updateRender(state => console.log('hi') || state
        .set('targetCircle.isShow', false)));

      return obsDictFactory(
        framesAndEvents$.pipe(
          flatMap(
            showCircleMoveGoblin$,
          ),
          takeWhile((args) => args[0].deltaTime < 2),
          mergeMap(() => hideCircle$),
        ),
      );
    }
    default:
      return undefined;
  }
}
