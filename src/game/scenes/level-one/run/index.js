import { fromJS } from 'immutable';
import { map } from 'rxjs/operators';

import engine from 'game/engine';
import { keyDown$, click$ } from './events/sources';
import eventsReducer from './events/reducer';
import _render, { renderInitialReturnState } from './render';
import { createGoblin } from './items/goblin';

export const eventSources = [
  keyDown$,
  click$,
];

export function update(gameLoopAttrs, deltaTime, inputState) {
  const {
    framesAndEvents$, updateGame,
  } = gameLoopAttrs;

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
});

export function start({ frames$, updateState }) {}

export function onFinishLoad(stage, sceneCustomRes) {
  return renderInitialReturnState(sceneCustomRes.gameMap, initialGameState);
}
