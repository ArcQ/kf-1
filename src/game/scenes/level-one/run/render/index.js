import engine from 'game/engine';
import { drawTargetCircle } from 'game/scenes/level-one/run/graphics/draw';
import { setPos } from 'utils/pixi.utils';

import createTiledMap from './tile-maps/create-tile-map';
import { createGoblinSprite } from '../items/goblin';

let spriteStore = {};

export function initialRender(gameMap, initialGameState) {
  const tileMap = createTiledMap(gameMap);
  tileMap.map(tile => engine.app.stage.addChild(tile));

  const goblin = createGoblinSprite(initialGameState.goblin);
  engine.app.stage.addChild(goblin);

  const moveTargetCircle = drawTargetCircle(initialGameState.getIn(['moveTargetCircle', 'pos']));
  engine.app.stage.addChild(moveTargetCircle);

  spriteStore = { goblin, moveTargetCircle };
}

export default function render(gameState) {
  if (!gameState) return;
  if (gameState.getIn(['moveTargetCircle', 'isShow'])) {
    // console.log(gameState.getIn(['moveTargetCircle','pos']));
    spriteStore.moveTargetCircle.visibility = true;
    setPos(spriteStore.moveTargetCircle, gameState.getIn(['moveTargetCircle', 'pos']));
  } else {
    spriteStore.moveTargetCircle.visibility = false;
  }
  // setPos(spriteStore.goblin, gameState.getIn(['goblin', 'pos']));
}
