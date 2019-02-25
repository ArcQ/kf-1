import engine from 'kf-game-engine';

import mainLoadingScene from '../loading/main';
import { generateGameMap } from './api';
import { initAnims } from './render/anims';

import {
  goblin, assasin,
} from './items/characters';
import { initialRender, tick } from './render';
import watchEvents from './event-listeners';

export const encoderKeys = [
  'NO_CHANGE',
  'P1',
  'P2',
  'SET_CHAR_STATE',
  'SET_SPRITE_POS',
  'CHANGE_ORIENTATION',
  'MOVE',
  'IDLE',
  'SPOT_ATTACK',
  'FINISH_SPOT_ATTACK',
];
export const levelOneEncoder = engine.encoder(encoderKeys);

const initialGameState = {
  goblin: goblin.create([100, 100]),
  assasin: assasin.create([200, 400]),
  moveTargetCircle: {
    isShow: false,
    pos: [100, 100],
  },
};

export default function getSceneObj(store) {
  return () => ({
    name: 'level-one-scene',
    encoderKeys,
    initConfig: { noChange: 'change' },
    loading: mainLoadingScene,
    uiRoute: '/level-one',
    assets: ['levelOne', 'chars'],
    willLoad: generateGameMap(store),
    start() {
      initAnims(levelOneEncoder);
      initialRender(store, levelOneEncoder, initialGameState);
      watchEvents(levelOneEncoder);
      return initialGameState;
    },
    update: tick(levelOneEncoder),
  });
}
