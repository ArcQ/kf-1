import { getSprite } from 'game/engine/asset-manager';

export default {
  name: 'mainLoadingScene',
  uiRoute: '/loading/main',
  assets: ['mainLoading'],
  onTick() {},
  onFinishLoad(stage) {
    const mushroom = getSprite('mainLoading', 'loading-animation');
    mushroom.x = 0;
    mushroom.y = 0;
    mushroom.width = 90;
    mushroom.height = 160;
    stage.addChild(mushroom);
  },
};
