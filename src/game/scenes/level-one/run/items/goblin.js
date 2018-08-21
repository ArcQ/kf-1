import * as PIXI from 'pixi.js';

export function createGoblinSprite() {
  const frames = Array(6).fill(0).map((v, i) => PIXI.Texture.fromFrame(`1_GOBLIN_WALK_00${i}.png`));

  // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
  const anim = new PIXI.extras.AnimatedSprite(frames);

  /*
   * An AnimatedSprite inherits all the properties of a PIXI sprite
   * so you can change its position, its anchor, mask it, etc
   */
  anim.x = 200;
  anim.y = 200;
  anim.height = 100;
  anim.width = 100;
  anim.anchor.set(0.5);
  anim.animationSpeed = 0.3;
  anim.play();
  return anim;
}

export function createGoblin(pos) {
  return {
    sprite: '', speed: 10, pos,
  };
}

export function move(traits, destination) {
  console.log(arguments);
  const origin = traits.get('pos');
  const diff = {
    y: destination[1] - traits.getIn(['pos', 1]),
    x: destination[0] - traits.getIn(['pos', 0]),
  };
  const rad = Math.atan(diff.y / diff.x);
  const xMult = Math.cos(rad);
  const yMult = Math.sin(rad);

  return (dt) => {
    const d = traits.speed * dt;
    return {
      x: d * xMult,
      y: d * yMult,
    };
  };
}
