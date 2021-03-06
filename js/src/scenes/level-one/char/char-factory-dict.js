import { getSpriteSheetFrames } from '@kf/game-utils/es/pixi/sprite';
import { handleEvents } from '../event-listeners';

// this needs to be a function, because we are importing the
// engine signleton and not passing it in, engine is not initiated when this file is imported
export default encoder => ({
  knight: {
    spriteSheetKs: ['chars', 'knights0', '_IDLE/_IDLE'],
  },
  assasin: {
    spriteSheetKs: ['chars', 'assasins0', '1_IDLE'],
    anims: {
      IDLE: ['chars', 'assasins0', '1_IDLE'],
      MOVE: ['chars', 'assasins0', '2_WALK'],
      SPOT_ATTACK: {
        frames: () => getSpriteSheetFrames('chars', 'assasins0', '6_ATTACK2'),
        spriteHandler: (sprite) => {
          sprite.loop = false;
        },
        onComplete: () => () => handleEvents(['FINISH_SPOT_ATTACK', 1], encoder),
      },
    },
  },
});
