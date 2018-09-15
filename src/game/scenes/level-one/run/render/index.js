import engine from 'game/engine';
import { drawTargetCircle } from 'game/scenes/level-one/run/graphics/draw';
import { setPos } from 'utils/pixi.utils';

import createTiledMap from './tile-maps/create-tile-map';
import characters from '../items/characters';

let spriteStore = {};

export function initialRender(gameMap, initialGameState) {
  const tileMap = createTiledMap(gameMap);
  tileMap.map(tile => engine.app.stage.addChild(tile));

  const charKeys = ['goblin', 'assasin', 'wizard', 'demon'];
  const sprites = charKeys.reduce((acc, k) => {
    const sprite = characters[k].sprite(initialGameState.getIn([k, 'pos']));
    engine.app.stage.addChild(sprite);
    return { ...acc, [k]: sprite };
  }, {});

  const moveTargetCircle = drawTargetCircle(initialGameState.getIn(['moveTargetCircle', 'pos']));
  engine.app.stage.addChild(moveTargetCircle);

  spriteStore = { ...sprites, moveTargetCircle };
}

export default function render(gameState) {
  if (!gameState) return;
  if (gameState.getIn(['moveTargetCircle', 'isShow'])) {
    spriteStore.moveTargetCircle.visible = true;
    setPos(spriteStore.moveTargetCircle, gameState.getIn(['moveTargetCircle', 'pos']));
  } else {
    spriteStore.moveTargetCircle.visible = false;
  }
  setPos(spriteStore.goblin, gameState.getIn(['goblin', 'pos']));
  setPos(spriteStore.assasin, gameState.getIn(['assasin', 'pos']));
}
