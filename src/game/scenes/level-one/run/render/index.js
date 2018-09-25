import engine from 'game/engine';
import { drawTargetCircle } from 'game/scenes/level-one/run/graphics/draw';
import { setPos } from 'utils/pixi.utils';
import { getIn } from 'utils/cljs.utils';

import createTiledMap from './tile-maps/create-tile-map';
import characters from '../items/characters';

let spriteStore = {};

export function initialRender(gameMap, initialPState) {
  const tileMap = createTiledMap(gameMap);
  tileMap.map(tile => engine.app.stage.addChild(tile));

  const charKeys = ['goblin', 'assasin', 'wizard', 'demon'];
  const sprites = charKeys.reduce((acc, k) => {
    const sprite = characters[k].sprite(getIn(initialPState, [k, 'pos']));
    engine.app.stage.addChild(sprite);
    return { ...acc, [k]: sprite };
  }, {});

  const moveTargetCircle = drawTargetCircle(getIn(initialPState, ['moveTargetCircle', 'pos']));
  engine.app.stage.addChild(moveTargetCircle);

  spriteStore = { ...sprites, moveTargetCircle };
}

export default function render(gameState) {
  if (!gameState) return;
  if (Object.keys(spriteStore).length === 0) return;
  if (getIn(gameState, ['moveTargetCircle', 'isShow'])) {
    spriteStore.moveTargetCircle.visible = true;
    setPos(spriteStore.moveTargetCircle, getIn(gameState, ['moveTargetCircle', 'pos']));
  } else {
    console.log(spriteStore);
    spriteStore.moveTargetCircle.visible = false;
  }
  setPos(spriteStore.goblin, getIn(gameState, ['goblin', 'pos']));
  setPos(spriteStore.assasin, getIn(gameState, ['assasin', 'pos']));
}
