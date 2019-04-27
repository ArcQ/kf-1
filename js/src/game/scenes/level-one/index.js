import engine from 'kf-game-engine';

import mainLoadingScene from '../loading/main';
import { generateGameMap } from './api';
import { initAnims } from './render/anims';
import setup from './setup';

import createCharacters from './entities/createCharacters';

import { initialRender, tick } from './render';
import watchEvents from './event-listeners';

const { encoderKeys, levelOneEncoder } = setup(engine.encoder);

const charMeta = {
  goblin: {
    pos: [100, 100],
  },
  assasin: {
    pos: [200, 400],
  },
};
const characters = createCharacters(charMeta);
const initialGameState = {
  goblin: characters.goblin.initialState,
  assasin: characters.assasin.initialState,
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
      initialRender(store, initialGameState, characters);
      watchEvents(levelOneEncoder);
      return initialGameState;
    },
    update: tick(levelOneEncoder),
  });
}
