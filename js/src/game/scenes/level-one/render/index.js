import engine from 'kf-game-engine';
import { safeGetIn } from 'utils/dictUtils';

import { setPos, ANCHOR_BM } from 'utils/pixi.utils';

import runAnimOnSprite from './anims';
import { TARGET_CIRCLE, PLAYER_U, PLAYER_2 } from '../constants';


import { drawTargetCircle } from '../graphics/draw';
import createTiledMap from './tile-maps/create-tile-map';

let spriteStore = {};

const spritePosOnChange = {
  [TARGET_CIRCLE]: () => {
    const sprite = spriteStore.moveTargetCircle;
    sprite.visible = true;
    return sprite;
  },
  [PLAYER_U]: () => spriteStore.assasin,
  [PLAYER_2]: () => spriteStore.goblin,
};

const spriteCharStateOnChange = {
  // [PLAYER_U]: byteData => encoder =>
  [PLAYER_U]: byteData => encoder =>
    runAnimOnSprite('assasin', encoder.decode(byteData[1]), spriteStore),
};

const ORIENTATION_RIGHT = 2;
const spriteOrientatonOnChange = {
  [PLAYER_U]: (byteData) => {
    const multiplier = (byteData[1] === ORIENTATION_RIGHT) ? -1 : 1;
    spriteStore.assasin.scale.x = Math.abs(spriteStore.assasin.scale.x) * multiplier;
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
  return gameStateByteArr =>
    levelOneEncoder
      .decodeByteArray(stateUpdateHandler)(gameStateByteArr);
}

export function initialRender(store, initialGameState, characters) {
  const gameMap = safeGetIn(store.getState(), ['levelOne', 'gameMap']);
  const tileMap = createTiledMap(gameMap);
  tileMap.map(tile => engine.app.stage.addChild(tile));

  const sprites = Object.entries(characters).reduce((acc, [k, { sprite }]) => {
    engine.app.stage.addChild(sprite);
    return { ...acc, [k]: sprite };
  }, {});

  const moveTargetCircle = drawTargetCircle(initialGameState.moveTargetCircle.pos);
  engine.app.stage.addChild(moveTargetCircle);

  spriteStore = { ...sprites, moveTargetCircle };
}
