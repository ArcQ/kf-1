import { assetManager, PIXI } from 'kf-game-engine';

export const goblin = {
  create(pos) {
    return ({
      sprite: '', speed: 10, pos,
    });
  },
  sprite(pos) {
    const frames = assetManager.getSpriteSheetFrames('chars', 'knights0', '_IDLE/_IDLE');
    const anim = new PIXI.extras.AnimatedSprite(frames);

    const testContainer = new PIXI.Container();
    testContainer.addChild(anim);

    const [x, y] = pos;
    anim.x = x;
    anim.y = y;
    anim.height = 100;
    anim.width = 100;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.3;
    anim.play();
    return anim;
  },
};

export const assasin = {
  create(pos) {
    return ({
      sprite: '', speed: 10, pos,
    });
  },
  sprite(pos) {
    const frames = assetManager.getSpriteSheetFrames('chars', 'assasins0', '1_IDLE');
    const anim = new PIXI.extras.AnimatedSprite(frames);

    const [x, y] = pos;
    anim.x = x;
    anim.y = y;
    anim.height = 100;
    anim.width = 100;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.3;
    anim.play();
    return anim;
  },
};

export default {
  goblin, assasin,
};
