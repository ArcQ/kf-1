import { getWHeight } from 'kf-utils/dist/render/global';

import { filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import engine from 'kf-game-engine';
import config from 'config.json';

function mapDOMPosToStage(pos) {
  return pos.map(v => v / window.devicePixelRatio);
}

export function handleEvents(formattedEvt, encoder) {
  const [evtK, ...args] = formattedEvt;
  const entityK = encoder.encode('P1');
  const encoded = [encoder.encode(evtK), entityK, ...args];
  engine.onEvent(encoded);
}

const clickEventsById = {
  ui: event => ['MOVE'].concat(
    mapDOMPosToStage([
      event.offsetX,
      event.offsetY - (config.game.charHeight * getWHeight() / (2 * config.game.aspectRatio.y)),
    ]),
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
