/**
 * setPos - set position of sprite (mutates original sprite)
 *
 * @param sprite
 * @param pos - pos is always an immutablearray
 * @returns {undefined}
 */
export function setPos(sprite, pos) {
  sprite.position.x = pos.get(0); //eslint-disable-line
  sprite.position.y = pos.get(1); //eslint-disable-line
}
