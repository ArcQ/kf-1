import { getSprite } from 'game/engine/asset-manager';
import mainLoadingScene from '../loading/main';

export default {
  name: 'mainGameScene',
  loading: mainLoadingScene,
  uiRoute: '/main',
  assets: ['main'],
  onTick() {
  },
  onFinishLoad(stage) {
    const mushroom = getSprite('main', 'mushroom');
    mushroom.x = 0;
    mushroom.y = 0;
    mushroom.width = 90;
    mushroom.height = 160;
    stage.addChild(mushroom);
  },
};
