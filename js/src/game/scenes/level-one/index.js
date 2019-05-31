import engine from 'kf-game-engine';
import { getWWidth, getWHeight } from 'utils/global';
import { mergeWith, merge } from 'ramda';

import mainLoadingScene from '../loading/main';
import { generateGameMap } from './api';
import { initAnims } from './render/anims';
import { getTileDims } from './render/tile-maps/create-tile-map';
import setup from './setup';

import { initialRender, tick } from './render';
import watchEvents from './event-listeners';

const { encoderKeys, levelOneEncoder } = setup(engine.encoder);

const charMeta = {
  game: {
    P1: {
      pos: [100, 100],
    },
    P2: {
      pos: [200, 200],
    },
  },
  render: {
    P1: {
      spriteK: 'assasin',
    },
    P2: {
      spriteK: 'knight',
    },
  },
};

const merge2ndLevel = mergeWith(merge);

const initialGameState = {
  char: merge2ndLevel(charMeta.game, charMeta.render),
  moveTargetCircle: {
    isShow: false,
    pos: [100, 100],
  },
};

export default function getSceneObj(store) {
  return () => ({
    name: 'level-one-scene',
    encoderKeys,
    initConfig: {
      map: getTileDims([getWHeight, getWWidth]),
      char: initialGameState.char.game,
    },
    loading: mainLoadingScene,
    uiRoute: '/level-one',
    assets: ['levelOne', 'chars'],
    willLoad: generateGameMap(store),
    start() {
      initAnims(levelOneEncoder);
      initialRender(store, initialGameState);
      watchEvents(levelOneEncoder);
      return initialGameState;
    },
    update: tick(levelOneEncoder),
  });
}
