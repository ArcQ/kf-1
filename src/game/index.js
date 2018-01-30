import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers } from 'recompose';
import { shouldNeverUpdate } from 'utils/recompose';
import sceneManager from 'game/engine/scene-manager';

import config from 'config.json';
import engine from './engine';

function MainGameView(props) {
  return (<div
    id="mainGameContainer"
    className="relative"
    ref={props.setRef}
  />);
}

MainGameView.propTypes = {
  setRef: PropTypes.func,
};

function initPixi(mainGameViewRef, store) {
  engine.start(config.game, mainGameViewRef, store);
  sceneManager.start(config.game);
}

// React should give off all control of rendering of this to pixi
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
