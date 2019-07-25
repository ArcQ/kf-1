import encoder from '@kf/game-utils/dist/wasm/encoder';
import { getWWidth, getWHeight } from '@kf/game-utils/dist/render/global';

import mainLoadingScene from '../loading/main';
import { generateGameMap } from './api';
import { getTileDims } from './render/tile-maps/create-tile-map';
import setup from './setup';

import { initialRender, tick } from './render';
import watchEvents from './event-listeners';

const { initialGameState, encoderKeys, levelOneEncoder } = setup(encoder);

export default function getSceneObj(store) {
  return () => ({
    name: 'level-one-scene',
    encoderKeys,
    initConfig: {
      map: getTileDims([getWHeight, getWWidth]),
      chars: initialGameState.chars,
    },
    loading: mainLoadingScene,
    uiRoute: '/level-one',
    assets: ['levelOne', 'chars'],
    willLoad: generateGameMap(store),
    start() {
      initialRender(store, initialGameState, levelOneEncoder);
      watchEvents(levelOneEncoder);
      return initialGameState;
    },
    update: tick(levelOneEncoder),
  });
}
