import { filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

const keyCodes = ['Enter'];

const keyDown$ = fromEvent(document, 'keydown')
  .pipe(
    map((event) => {
      if (keyCodes.indexOf(event.code) > -1) {
        return event.code;
      }
      return undefined;
    }),
    filter(keyMap => keyMap !== undefined),
  );

const click$ = fromEvent(document, 'click')
  .pipe(
    map(event => ({
      type: 'click',
      x: event.offsetX,
      y: event.offsetY,
    })),
  );

export default [
  keyDown$,
  click$,
];
