import { pipe, reduce, merge } from 'ramda';

const createCharConfig = (game, render) => ({ game, render });

const getCombinedProps = _charProps =>
  pipe(
    reduce((prev, [k, props]) => ({
      ...prev,
      [k]: merge(props.game, props.render),
    }), {}),
  )(Object.entries(_charProps));

export default function(encoder) {
  const encoderKeys = [
    'NO_CHANGE',
    'P1',
    'P2',
    'SET_CHAR_STATE',
    'SET_SPRITE_POS',
    'CHANGE_ORIENTATION',
    'MOVE',
    'IDLE',
    'SPOT_ATTACK',
    'FINISH_SPOT_ATTACK',
  ];

  const levelOneEncoder = encoder(encoderKeys);

  const charProps = {
    P1: createCharConfig({
      charK: 'assasin',
    }, {
      pos: [100, 100],
    }),
    P2: createCharConfig({
      charK: 'knight',
    }, {
      pos: [200, 200],
    }),
  };

  const charConfig = pipe(
    getCombinedProps,
    merge({ keys: Object.keys(charProps) }),
  )(charProps);

  const initialGameState = {
    charConfig,
    chars: charConfig,
    moveTargetCircle: {
      isShow: false,
      pos: [100, 100],
    },
  };

  return { encoderKeys, levelOneEncoder, initialGameState };
}
