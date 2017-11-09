import { getSprite } from 'game/asset-manager';

export default {
  name: 'mainGameScene',
  assets: ['main'],
  onFinishLoad(stage) {
    const mushroom = getSprite('main', 'mushroom');
    mushroom.x = 0;
    mushroom.y = 0;
    mushroom.width = 90;
    mushroom.height = 160;
    stage.addChild(mushroom);
  },
};
