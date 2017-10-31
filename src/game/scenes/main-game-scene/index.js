import { getSprite } from 'game/asset-manager';

export default {
  name: 'mainGameScene',
  assets: ['main'],
  onFinishLoad(stage) {
    const mushroom = getSprite('main', 'mushroom');
    stage.addChild(mushroom);
  },
};
