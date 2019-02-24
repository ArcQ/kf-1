import { assetManager } from 'kf-game-engine';

export default function getSceneObj() {
  return {
    name: 'mainLoadingScene',
    uiRoute: '/loading/main',
    assets: ['mainLoading'],
    onFinishLoad() {},
  };
}
