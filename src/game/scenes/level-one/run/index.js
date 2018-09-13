import { fromJS } from 'immutable';

import { keyDown$, click$ } from './event-sources';
import _update from './update';
import _render, { initialRender } from './render';
import {
  goblin, demon, assasin, wizard,
} from './items/characters';

export const eventSources = [
  keyDown$,
  click$,
];

export const update = _update;

export const render = _render;

const initialGameState = fromJS({
  goblin: goblin.create([100, 100]),
  demon: demon.create([200, 200]),
  wizard: wizard.create([100, 300]),
  assasin: assasin.create([200, 400]),
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
