import * as PIXI from 'pixi.js';
import { fromJS } from 'immutable';

import { movePointIm } from 'utils/immutable.utils';

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

function checkIfPastF(diff, destination) {
  const signs = diff.map(d => Math.sign(d));
  return nextPt =>
    signs
      .map((s, i) => Math.sign(destination[i] - nextPt.get(i)) !== s)
      .reduce((acc, v) => v || acc, false);
}

export function move(traits, destination) {
  const diff = [
    destination[0] - traits.getIn(['pos', 0]),
    destination[1] - traits.getIn(['pos', 1]),
  ];
  const normalized = diff.map(() => diff[0] / Math.abs(diff[0]));

  const rad = Math.atan(diff[1] / diff[0]);
  const multipliers = [
    Math.cos(rad),
    Math.sin(rad),
  ];

  const checkIfPast = checkIfPastF(diff, destination);

  const destinationIm = fromJS(destination);

  return (curPos, dt) => {
    const dist = traits.get('speed') * dt * 5;
    const moveDiff = multipliers.map((m, i) => m * dist * normalized[i]);
    const nextPt = movePointIm(curPos, moveDiff);
    return checkIfPast(nextPt)
      ? destinationIm : nextPt;
  };
}
