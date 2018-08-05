import request from 'utils/request';
import mainLoadingScene from '../loading/main';
import { obsGetterList, update, onFinishLoad } from './run';

const state = {
  gameMap: undefined,
};

const scene = {
  name: 'level-one-scene',
  loading: mainLoadingScene,
  uiRoute: '/level-one',
  assets: ['levelOne', 'goblins'],
  load$: request('/gamemap/generate'),
  obsGetterList,
  update,
  onFinishLoad,
};

export default scene;
