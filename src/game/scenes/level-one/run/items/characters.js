import * as PIXI from 'pixi.js';

export const goblin = {
  create(pos) {
    return ({
      sprite: '', speed: 10, pos,
    });
  },
  sprite(pos) {
    const frames = Array(6)
      .fill(0)
      .map((v, i) =>
        PIXI.Texture.fromFrame(`1_GOBLIN_WALK_00${i}.png`));

    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    const anim = new PIXI.extras.AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    anim.x = pos[0];
    anim.y = pos[1];
    anim.height = 100;
    anim.width = 100;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.3;
    anim.play();
    return anim;
  }
};

export const demon = {
  create(pos) {
    return ({
      sprite: '', speed: 10, pos,
    })
  },
  sprite(pos) {
    const frames = Array(6)
      .fill(0)
      .map((v, i) =>
        PIXI.Texture.fromFrame(`1_GOBLIN_WALK_00${i}.png`));

    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    const anim = new PIXI.extras.AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    anim.x = pos[0];
    anim.y = pos[1];
    anim.height = 100;
    anim.width = 100;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.3;
    anim.play();
    return anim;
  },
};

export const wizard = {
  create(pos) {
    return ({
      sprite: '', speed: 10, pos,
    })
  },
  sprite(pos) {
    const frames = Array(6)
      .fill(0)
      .map((v, i) =>
        PIXI.Texture.fromFrame(`1_GOBLIN_WALK_00${i}.png`));

    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    const anim = new PIXI.extras.AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    anim.x = pos[0];
    anim.y = pos[1];
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
    const frames = Array(5)
      .fill(0)
      .map((v, i) =>
        PIXI.Texture.fromFrame(`2_WALK_00${i}assasin.png`));

    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    const anim = new PIXI.extras.AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    anim.x = pos[0];
    anim.y = pos[1];
    anim.height = 100;
    anim.width = 100;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.3;
    anim.play();
    return anim;
  },
};

export default {
  goblin, demon, wizard, assasin,
};
