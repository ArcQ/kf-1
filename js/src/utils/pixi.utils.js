export const ANCHOR_MID = 'm';
export const ANCHOR_TR = 'tm';
export const ANCHOR_BM = 'bm';

const BUFFER = 2;

const handleAnchor = {
  [ANCHOR_MID]: (pos) => pos,
  [ANCHOR_TR]: (sprite, pos) => [
    pos.x + sprite.width,
    pos.y + sprite.height,
],
  [ANCHOR_BM]: (sprite, pos) => [
    pos[0],
    pos[1] + 2 - (sprite.height / 2),
  ],
};

/**
 * setPos - set position of sprite (mutates original sprite)
 *
 * @param sprite
 * @param pos - pos is always an immutablearray
 * @param anchor {string} - ANCHOR_MID is middle, ANCHOR_TR is top right, ANCHOR_BM is bottom middle, default is middle
 * @returns {undefined}
 */
export function setPos(sprite, pos, anchor) {
  const handler = handleAnchor[anchor];
  const spritePos =  handler ? handler(sprite, pos) : pos;
  sprite.position.x = spritePos[0]; //eslint-disable-line
  sprite.position.y = spritePos[1]; //eslint-disable-line
}
