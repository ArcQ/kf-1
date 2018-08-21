/**
 * setPos - set position of sprite (mutates original sprite)
 *
 * @param sprite
 * @param pos
 * @returns {undefined}
 */
export function setPos(sprite, pos) {
  sprite.position.x = pos[0]; //eslint-disable-line
  sprite.position.y = pos[1]; //eslint-disable-line
}
