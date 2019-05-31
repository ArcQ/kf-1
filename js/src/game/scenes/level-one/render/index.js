import { safeGetIn } from 'utils/dictUtils';
import { setPos, ANCHOR_BM } from 'utils/pixi.utils';
import engine from 'kf-game-engine';
import {
  flatten,
  map,
  values,
  pipe,
} from 'ramda';

import { TARGET_CIRCLE, PLAYER_U, PLAYER_2 } from '../constants';
import { drawTargetCircle } from '../graphics/draw';
import createCharacters from '../entities/createCharacters';
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
  [PLAYER_U]: () => renderStore.characters[PLAYER_U].sprite,
  [PLAYER_2]: () => renderStore.characters[PLAYER_U].sprite,
};

const spriteCharStateOnChange = {
  // [PLAYER_U]: byteData => encoder =>
  [PLAYER_U]: byteData => encoder =>
    runAnimOnSprite(PLAYER_U, encoder.decode(byteData[1]), renderStore.characters),
};

const ORIENTATION_RIGHT = 2;
const spriteOrientatonOnChange = {
  [PLAYER_U]: (byteData) => {
    const multiplier = (byteData[1] === ORIENTATION_RIGHT) ? -1 : 1;
    renderStore.characters[PLAYER_U].scale.x = Math.abs(
      renderStore.characters[PLAYER_U].scale.x,
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
  return gameStateByteArr =>
    levelOneEncoder
      .decodeByteArray(stateUpdateHandler)(gameStateByteArr);
}

export function initialRender(store, initialGameState) {
  // adds sequentially
  const addAllToStage = pipe(
    flatten,
    map(s => engine.app.stage.addChild(s)),
  );
  const mapVal = pipe(values, map(v => v.sprite));
  const characters = createCharacters(initialGameState.char);
  const gameMap = safeGetIn(store.getState(), ['levelOne', 'gameMap']);
  const moveTargetCircle = { sprite: drawTargetCircle(initialGameState.moveTargetCircle.pos) };

  const tileMapSprites = createTiledMap(gameMap);
  const charSprites = mapVal(characters);
  const graphicSprites = [moveTargetCircle.sprite];

  addAllToStage([tileMapSprites, charSprites, graphicSprites]);
  renderStore = { characters, graphics: moveTargetCircle };
}
