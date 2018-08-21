import * as PIXI from 'pixi.js';
import { setPos } from 'utils/pixi.utils';

export function drawTargetCircle(pos) {
  const graphics = new PIXI.Graphics();
  graphics.lineStyle(2, 0xFF00FF);
  graphics.drawCircle(0, 0, 20);
  setPos(graphics, pos);
  graphics.endFill();
  return graphics;
}
