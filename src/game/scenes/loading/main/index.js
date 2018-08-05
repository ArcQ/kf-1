import { getSprite } from 'game/engine/asset-manager';

export default {
  name: 'mainLoadingScene',
  uiRoute: '/loading/main',
  assets: ['mainLoading'],
  onTick() {},
  onFinishLoad(stage) {
    const loadingSprite = getSprite('mainLoading', 'loading-animation');
    loadingSprite.x = 0;
    loadingSprite.y = 0;
    loadingSprite.width = 90;
    loadingSprite.height = 160;
    stage.addChild(loadingSprite);
  },
};
