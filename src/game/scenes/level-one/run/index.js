import { of } from 'rxjs';
import { scan, tap, combineLatest, takeWhile } from 'rxjs/operators';
import * as PIXI from 'pixi.js'

import engine from 'game/engine';
import { obsDictFactory } from 'game/engine/game-loop/update.utils';
import { safeGetFn } from 'utils/dictUtils';

import { createGoblin } from './sprites/goblin';
import createTiledMap from './tile-maps/create-tile-map';
import events from './events';


function _render(state) {};

export const obsList = events;

const eventObsDict = {
  click: ([frames$, stage, updateState, deltaTime, state, inputState], inputDef) => {
    const addCircleToStageAndReturn = () =>  {
      console.log(inputDef);
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(2, 0xFF00FF);
      graphics.drawCircle(...inputDef.pos, 20);
      graphics.endFill();
      stage.addChild(graphics);
      return graphics;
    }
    const drawTempCircle$ = of(addCircleToStageAndReturn());
    return obsDictFactory(
      frames$.pipe(
        combineLatest(drawTempCircle$),
        scan((acc, v) => acc + v),
        tap((v) => console.log(v) || v),
        takeWhile(val => val < 2),
      ))
  },
};

export function update(...args) {
  const [ frames$, stage, updateState, deltaTime, state, inputState ] = args;
  if (inputState.length > 0) {
    state.x = state.x ? state.x + 1 : 1;
    const obsArr = inputState.map(
      (def) => {
        const obsDict = safeGetFn([def.type], eventObsDict)(args, def);
        // should use safeGetFn for good practice, but it seems like we can't do this ramda style
        obsDict.obs.subscribe();
      },
    );
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
