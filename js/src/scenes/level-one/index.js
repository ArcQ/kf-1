import encoder from '@kf/game-utils/es/wasm/encoder';
import { getWWidth, getWHeight } from '@kf/game-utils/es/render/global';
import createUpdateHandlers from '@kf/kf1-utils/es/createUpdateHandlers';

import mainLoadingScene from '../loading/main';
import { generateGameMap } from './api';
import { getTileDims } from './render/tile-maps/create-tile-map';
import setup from './setup';

import { initialRender } from './render';
import {
  spritePosOnChange,
  spriteCharStateOnChange,
  spriteOrientatonOnChange,
} from './render/stateOnChange';
import watchEvents from './event-listeners';

const { initialGameState, encoderKeys, levelOneEncoder } = setup(encoder);

export default function getSceneObj(store) {
  return () => ({
    name: 'level-one-scene',
    autoPlay: {
      instanceName: 'instance-1',
    },
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
    encoder: levelOneEncoder,
    updateHandlers: createUpdateHandlers(levelOneEncoder, {
      spritePosOnChange,
      spriteCharStateOnChange,
      spriteOrientatonOnChange,
    }),
  });
}
