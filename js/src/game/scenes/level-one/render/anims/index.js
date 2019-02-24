import { assetManager } from 'kf-game-engine';

import { handleEvents } from '../../event-listeners';

let anims;

export function initAnims(encoder) {
  anims = {
    assasin: {
      IDLE: {
        frames: () => assetManager.getSpriteSheetFrames('chars', 'assasins0', '1_IDLE'),
        spriteHandler: (sprite) => {
          sprite.loop = true;
        },
      },
      MOVE: {
        frames: () => assetManager.getSpriteSheetFrames('chars', 'assasins0', '2_WALK'),
        spriteHandler: (sprite) => {
          sprite.loop = true;
        },
      },
      SPOT_ATTACK: {
        frames: () => assetManager.getSpriteSheetFrames('chars', 'assasins0', '6_ATTACK2'),
        spriteHandler: (sprite) => {
          sprite.loop = false;
        },
        onComplete: () => () => handleEvents(['FINISH_SPOT_ATTACK', 1], encoder),
      },
    },
  };
}

export default function runAnimOnSprite(k, charState, spriteStore) {
  const animDef = anims[k][charState];
  const sprite = spriteStore[k];
  sprite.stop();
  sprite.textures = animDef.frames();
  if (animDef.spriteHandler) animDef.spriteHandler(sprite);
  if (animDef.onComplete) {
    sprite.onComplete = animDef.onComplete(sprite);
  }
  sprite.play();
}
