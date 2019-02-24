import { filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import engine from 'kf-game-engine';
import { CHAR_HEIGHT } from './constants';

function mapDOMPosToStage(pos) {
  return pos.map(v => v / 2);
}


export function handleEvents(formattedEvt, encoder) {
  const [evtK, ...args] = formattedEvt;
  const entityK = encoder.encode('P1');
  const encoded = [encoder.encode(evtK), entityK, ...args];
  engine.wasmUpdate(encoded);
}

const clickEventsById = {
  ui: event => ['MOVE'].concat(
    mapDOMPosToStage([event.offsetX, event.offsetY - (CHAR_HEIGHT / 2)]),
  ),
  attackOneBtn: () => ['SPOT_ATTACK'].concat([1]),
};

// maybe we should just listen on document and filter down into right event,
// but this is probably safer, depending on how the ui ends up
const clickEvents$ = () => Object.entries(clickEventsById)
  .map(([id, formatEvt]) =>
    fromEvent(document.getElementById(id), 'click')
      .pipe(
        filter(event => event.target.id !== 'root'),
        map((e) => {
          e.stopPropagation();
          return formatEvt(e);
        }),
      ));

export default function watchEvents(encoder) {
  const eventSources$ = [
    ...clickEvents$(),
  ];

  eventSources$.map(evt$ => evt$.subscribe(formattedEvt =>
    handleEvents(formattedEvt, encoder)));
}
