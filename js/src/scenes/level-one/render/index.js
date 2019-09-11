import { addAllToStage } from '@kf/game-utils/es/pixi/sprite';
import engine from '@kf/game-engine';
import { createChars, getSpritesFromChars } from '@kf/game-engine/es/renderer/CharFactory';
import charFactoryDict from 'scenes/level-one/char/char-factory-dict';
import {
  path,
} from 'ramda';

import { drawTargetCircle } from '../graphics/draw';
import createTiledMap from './tile-maps/create-tile-map';
import renderStore from './renderStore';

export function initialRender(store, initialGameState, levelOneEncoder) {
  const { keys, ...charConfig } = initialGameState.chars;
  const chars = createChars(
    charConfig,
    charFactoryDict(levelOneEncoder),
  );

  const moveTargetCircle = { sprite: drawTargetCircle(initialGameState.moveTargetCircle.pos) };
  const gameMap = path(['levelOne', 'gameMap'], store.getState());

  const tileMapSprites = createTiledMap(gameMap);
  const charSprites = getSpritesFromChars(chars);
  const graphicSprites = [moveTargetCircle.sprite];
  addAllToStage(engine, [tileMapSprites, charSprites, graphicSprites]);

  renderStore.store = { chars, graphics: moveTargetCircle };
}
