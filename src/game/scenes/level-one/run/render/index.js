import { fromJS } from 'immutable';

import engine from 'game/engine';
import { drawTargetCircle } from 'game/scenes/level-one/run/graphics/draw';
import { setPos } from 'utils/pixi.utils';

import createTiledMap from './tile-maps/create-tile-map';
import { createGoblinSprite } from '../items/goblin';

let spriteStore = {};


export function renderInitialReturnState(gameMap, initialGameState) {
  const initialRenderState = fromJS({
    'goblin.pos': initialGameState.goblin,
    'goblin.isShow': false,
    'moveTargetCircle.pos': [100, 100],
  });

  const tileMap = createTiledMap(gameMap);
  tileMap.map(tile => engine.app.stage.addChild(tile));

  const goblin = createGoblinSprite(initialGameState.goblin);
  engine.app.stage.addChild(goblin);


  const moveTargetCircle = drawTargetCircle(initialRenderState.get('moveTargetCircle.pos'));
  engine.app.stage.addChild(moveTargetCircle);

  // side effect
  spriteStore = { goblin, moveTargetCircle };

  return {
    initialGameState,
    initialRenderState,
  };
}

export default function render(renderState) {
  if (!renderState) return;
  if (renderState.get('targetCircle.pos')) {
    setPos(spriteStore.moveTargetCircle, renderState.get('targetCircle.pos'));
  }
  if (renderState.get('targetCircle.isShow')) {
    spriteStore.moveTargetCircle.visibility = true;
  } else {
    spriteStore.moveTargetCircle.visibility = false;
  }
}
