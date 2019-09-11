// things that we only need in dev

import wrapAllProps from '@kf/game-utils/es/dict/wrapAllProps';

function onlyRunInProd(f) {
  if (process.env !== 'prod') f();
}

function keepTrackOfGlobalState() {

}

const devUtils = {
  keepTrackOfGlobalState,
};

export default wrapAllProps(devUtils, onlyRunInProd)
