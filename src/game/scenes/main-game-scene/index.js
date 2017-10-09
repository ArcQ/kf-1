import { getSprite } from 'game/asset-manager';

export default {
  name: 'mainGameScene',
  assets: ['main'],
  start(stage) {
    const mushroom = getSprite('mainDict', 'mushroom');
    stage.addChild(mushroom);
  },
  onFinishLoad() {
    console.log('finished');
  }
};
