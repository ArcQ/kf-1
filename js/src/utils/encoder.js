import { compose } from 'recompose';

function encode(encoderKeys) {
  return k => encoderKeys.indexOf(k);
}

function decode(encoderKeys) {
  return i => encoderKeys[i];
}

function splitIntoBlocksOfState({ stateBlocks, origByteArr }) {
  if (!origByteArr || origByteArr.length === 0) {
    return stateBlocks;
  }
  const [subStateLen, ...restByteArr] = origByteArr;
  const nextByteArr = restByteArr.splice(subStateLen - 1);
  stateBlocks.push(restByteArr);
  return splitIntoBlocksOfState({ stateBlocks, origByteArr: nextByteArr });
}


export default (encoderKeys) => {
  const encoder = {
    encode: encode(encoderKeys),
    decode: decode(encoderKeys),
    decodeByteArray(stateUpdateHandler) {
      return (gameStateByteArr) => {
        splitIntoBlocksOfState({ stateBlocks: [], origByteArr: gameStateByteArr })
          .map(([k, ...data]) =>
            stateUpdateHandler[encoder.decode(k)](data)(encoder));
      };
    },
  };
  return encoder;
};
