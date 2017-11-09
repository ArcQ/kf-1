import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers } from 'recompose';
import { neverUpdate } from 'core/utils/recompose';
import { getWWidth, getWHeight } from 'core/utils/global';

import config from 'config.json';
import engine from './engine';
import sceneManager from './scenes/manager';

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

function initPixi(mainGameViewRef) {
  engine.start(config.game, mainGameViewRef);
  sceneManager.start(config.game);
}

// React should give off all control of rendering of this to pixi
const initPixiOnMount = lifecycle({
  componentDidMount() {
    this.props.initPixi();
  },
});

export default compose(
  withHandlers(() => {
    let mainGameViewRef;
    return {
      setRef: () => (ref) => { mainGameViewRef = ref; },
      initPixi: () => () => initPixi(mainGameViewRef),
    };
  }),
  neverUpdate,
  initPixiOnMount,
)(MainGameView);
