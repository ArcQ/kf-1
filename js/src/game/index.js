/**
 * Handle the passing off of react rendering to pixi game view
 * @module game
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers } from 'recompose';
import { shouldNeverUpdate } from 'utils/recompose';

import config from 'config.json';
import assetDicts from 'assets';
import engine, { sceneManager } from 'kf-game-engine';
import getLevelOne from 'game/scenes/level-one';
import safeGetIn from 'utils/dictUtils';

/**
 * React Game View
 * @returns {React.node}
 */
function MainGameView(props) {
  return (
    <div
      id="mainGameContainer"
      className="relative"
      ref={props.setRef}
    />
  );
}

MainGameView.propTypes = {
  setRef: PropTypes.func,
};

/**
 * initPixi - initiates the game engine and scene manager
 *
 * @param mainGameViewRef
 * @param store
 * @returns {undefined}
 */

function storeFn(store) {
  return {
    dispatch: store.dispatch,
    select: ks => safeGetIn(store, ks),
  };
}


function initPixi(mainGameViewRef, store) {
  const sceneDict = { levelOne: getLevelOne(store) };
  engine.start(config.game, mainGameViewRef, storeFn(store), assetDicts);
  sceneManager.start(config.game, sceneDict, storeFn(store));
}

const initPixiOnMount = lifecycle({
  componentDidMount() {
    this.props.initPixi();
  },
});

export default compose(
  withHandlers((props) => {
    let mainGameViewRef;
    return {
      setRef: () => (ref) => { mainGameViewRef = ref; },
      initPixi: () => () => initPixi(mainGameViewRef, props.store),
    };
  }),
  shouldNeverUpdate,
  initPixiOnMount,
)(MainGameView);
