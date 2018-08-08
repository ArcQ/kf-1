import engine from 'game/engine';

import { createGoblin } from './sprites/goblin';
import createTiledMap from './tile-maps/create-tile-map';
import events from './events';

function _render(state) {};

export const obsList = events;

function inputReducer() {
}

export function update(deltaTime, state, inputState) {
  if (inputState.length > 0) {
    console.log(deltaTime, state, inputState);
    engine.web.screen.offset;
    state.x = state.x ? state.x + 1 : 1;
  }
  _render(state);
  return state;
}

export function onFinishLoad(stage, sceneCustomRes) {
  const tileMap = createTiledMap(sceneCustomRes.gameMap);
  tileMap.map(tile => stage.addChild(tile));

  const goblin = createGoblin();
  stage.addChild(goblin);
}

export default {};
