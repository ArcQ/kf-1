import { fromJS } from 'immutable';

import { keyDown$, click$ } from './event-sources';
import _update from './update';
import _render, { initialRender } from './render';
import { createGoblin } from './items/goblin';

export const eventSources = [
  keyDown$,
  click$,
];

export const update = _update;

export const render = _render;

const initialGameState = fromJS({
  goblin: createGoblin([200, 200]),
  moveTargetCircle: {
    isShow: false,
    pos: [100, 100],
  },
});

export function start() {}

export function onFinishLoad(stage, sceneCustomRes) {
  initialRender(sceneCustomRes.gameMap, initialGameState);
  return initialGameState;
}
