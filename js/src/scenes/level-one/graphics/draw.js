import { PIXI } from '@kf/game-engine';
import { setPos } from '@kf/game-utils/dist/pixi/sprite';

export function drawTargetCircle(pos) {
  const graphics = new PIXI.Graphics();
  graphics.lineStyle(2, 0xFF00FF);
  graphics.drawCircle(0, 0, 20);
  setPos({ sprite: graphics, pos });
  graphics.endFill();
  return graphics;
}
