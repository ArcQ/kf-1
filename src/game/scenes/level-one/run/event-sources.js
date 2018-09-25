import { filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { mapDOMPosToStage } from 'game/engine/game-loop/render.utils';

const keyCodes = ['Enter'];

export const keyDown$ = fromEvent(document, 'keydown')
  .pipe(
    map((event) => {
      if (keyCodes.indexOf(event.code) > -1) {
        return event.code;
      }
      return undefined;
    }),
    filter(keyMap => keyMap !== undefined),
  );

export const click$ = fromEvent(document, 'click')
  .pipe(
    // clicked outside of app container (side borders)
    filter(event => event.target.id !== 'root'),
    map(event => ({
      type: 'charMove',
      key: 'goblin',
      pos: mapDOMPosToStage([event.offsetX, event.offsetY]),
    })),
  );

export default {};
