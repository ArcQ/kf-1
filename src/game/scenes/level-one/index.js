import {
  start, eventSources, update, onFinishLoad,
} from './run/run';
import mainLoadingScene from '../loading/main';
import { generateGameMap } from './api';

export default function getSceneObj() {
  return {
    name: 'level-one-scene',
    loading: mainLoadingScene,
    uiRoute: '/level-one',
    assets: ['levelOne', 'goblins'],
    load$: generateGameMap(),
    eventSources,
    start,
    update,
    onFinishLoad,
  };
}
