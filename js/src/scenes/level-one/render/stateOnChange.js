import {
  setPos,
  ANCHOR_BM,
} from '@kf/game-utils/es/pixi/sprite';

import runAnimOnSprite from './anims';
import renderStore from './renderStore';
import { TARGET_CIRCLE, PLAYER_U, PLAYER_2 } from '../constants';

const wrapInSetPos = f => (pos) => {
  const sprite = f(pos);
  setPos({ sprite, pos, anchor: ANCHOR_BM });
};

export const spritePosOnChange = {
  [TARGET_CIRCLE]: () => {
    const sprite = renderStore.store.graphics.sprite.moveTargetCircle;
    sprite.visible = true;
    return sprite;
  },
  [PLAYER_U]: wrapInSetPos(() => renderStore.store.chars[PLAYER_U].sprite),
  [PLAYER_2]: wrapInSetPos(() => renderStore.store.chars[PLAYER_U].sprite),
};

export const spriteCharStateOnChange = {
  [PLAYER_U]: byteData => encoder =>
    runAnimOnSprite(renderStore.store.chars[PLAYER_U], encoder.decode(byteData[1])),
};

const ORIENTATION_RIGHT = 2;
export const spriteOrientatonOnChange = {
  [PLAYER_U]: (byteData) => {
    const multiplier = (byteData[1] === ORIENTATION_RIGHT) ? -1 : 1;
    renderStore.store.chars[PLAYER_U].sprite.scale.x = Math.abs(
      renderStore.store.chars[PLAYER_U].sprite.scale.x,
    ) * multiplier;
  },
};
