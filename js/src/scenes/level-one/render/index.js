import {
  setPos,
  ANCHOR_BM,
  createCharEntities,
  getSpritesFromCharEntities,
  addAllToStage,
} from 'kf-utils/dist/pixi/sprite';
import engine from 'kf-game-engine';
import charFactoryDict from 'scenes/level-one/charEntities/char-factory-dict';
import {
  path,
} from 'ramda';

import { TARGET_CIRCLE, PLAYER_U, PLAYER_2 } from '../constants';
import { drawTargetCircle } from '../graphics/draw';
import createTiledMap from './tile-maps/create-tile-map';
import runAnimOnSprite from './anims';

// should probably be combined into one render store, maybe in memory sql based
let renderStore = {};

const spritePosOnChange = {
  [TARGET_CIRCLE]: () => {
    const sprite = renderStore.graphics.sprite.moveTargetCircle;
    sprite.visible = true;
    return sprite;
  },
  [PLAYER_U]: () => renderStore.charEntities[PLAYER_U].sprite,
  [PLAYER_2]: () => renderStore.charEntities[PLAYER_U].sprite,
};

const spriteCharStateOnChange = {
  [PLAYER_U]: byteData => encoder =>
    runAnimOnSprite(renderStore.charEntities[PLAYER_U], encoder.decode(byteData[1])),
};

const ORIENTATION_RIGHT = 2;
const spriteOrientatonOnChange = {
  [PLAYER_U]: (byteData) => {
    const multiplier = (byteData[1] === ORIENTATION_RIGHT) ? -1 : 1;
    renderStore.charEntities[PLAYER_U].sprite.scale.x = Math.abs(
      renderStore.charEntities[PLAYER_U].sprite.scale.x,
    ) * multiplier;
  },
};
// TODO, we should actually update the overall game state,
// and then set pos in two seperate step, so the nodejs code runs the same as the client code
const stateUpdateHandler = {
  SET_SPRITE_POS: byteData => (encoder) => {
    const pos = byteData.splice(-2);
    const handler = spritePosOnChange[encoder.decode(byteData[0])];
    if (handler) {
      const sprite = handler();
      setPos({ sprite, pos, anchor: ANCHOR_BM });
    }
  },
  SET_CHAR_STATE: byteData => (encoder) => {
    const handler = spriteCharStateOnChange[encoder.decode(byteData[0])];
    if (handler) handler(byteData)(encoder);
  },
  CHANGE_ORIENTATION: byteData => (encoder) => {
    const handler = spriteOrientatonOnChange[encoder.decode(byteData[0])];
    if (handler) handler(byteData);
  },
};

export function tick(levelOneEncoder) {
  console.log(levelOneEncoder);
  return gameStateByteArr =>
    levelOneEncoder
      .decodeByteArray(stateUpdateHandler)(gameStateByteArr);
}

export function initialRender(store, initialGameState, levelOneEncoder) {
  const charEntities = createCharEntities(
    engine,
    initialGameState.charEntities,
    charFactoryDict(levelOneEncoder),
  );

  const moveTargetCircle = { sprite: drawTargetCircle(initialGameState.moveTargetCircle.pos) };
  const gameMap = path(['levelOne', 'gameMap'], store.getState());

  const tileMapSprites = createTiledMap(gameMap);
  const charEntitySprites = getSpritesFromCharEntities(charEntities);
  const graphicSprites = [moveTargetCircle.sprite];
  addAllToStage(engine, [tileMapSprites, charEntitySprites, graphicSprites]);

  renderStore = { charEntities, graphics: moveTargetCircle };
}
