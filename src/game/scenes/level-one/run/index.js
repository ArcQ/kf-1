import { fromJS } from 'immutable';

import { keyDown$, click$ } from './events/sources';
import eventsReducer from './events/reducer';
import _render, { initialRender } from './render';
import { createGoblin } from './items/goblin';

export const eventSources = [
  keyDown$,
  click$,
];

export function update(gameLoopAttrs, deltaTime, inputState) {
  if (inputState.length > 0) {
    const obsArr = inputState.map(
      (def) => {
        // const obsDict = safeGetFn([def.type], eventReducer)(gameLoopAttrs, def);
        const obsDict = eventsReducer(gameLoopAttrs, def);
        obsDict.obs.subscribe();
        return obsDict;
      },
    );
  }
}

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
