import * as PIXI from 'pixi.js';
// import { push } from 'react-router-redux';
import scaleToWindowPixi from 'scale-to-window-pixi';
import assetManager from './asset-manager';
import sceneManager from './scene-manager';
import utils from './utils';

import { getWindow, getDocument, devicePixelRatio } from 'utils/global';

function getDimensions(aspectRatio, _getWindow) {
  const wWidth = _getWindow().screen.width;
  const wHeight = _getWindow().screen.height;

  const isLimitWidth = ((aspectRatio * wWidth) / wHeight) < 0;
  return (isLimitWidth)
    ? {
      x: wWidth,
      y: wWidth * aspectRatio,
    }
    : {
      x: wHeight / aspectRatio,
      y: wHeight,
    };
}

function resizeContainers(app, mainGameViewRef, engine) {
  const scale = scaleToWindowPixi(
    {
      containerSel: '.app',
    },
    getWindow,
    getDocument,
    '#333',
  )(app.renderer.view);
  engine.scale = scale;
  engine.web.screen.bounds = [
    getDocument().querySelector('.app').clientWidth,
    getDocument().querySelector('.app').clientHeight,
  ];
  engine.web.screen.offset = [
    getDocument().querySelector('.app').offsetLeft,
    getDocument().querySelector('.app').offsetTop,
  ];
}

const engine = {
  app: null,
  assetUrl: "https://s3.ca-central-1.amazonaws.com/dev-assets-1/",
  web: {
    screen: {
      bounds: null,
      offset: null,
    },
  },
  scale: null,
  ui: {
    dispatch(action) {},
    select(key) {},
  },

  /**
   * starts the scene manager with a default scene as specified in the config
   *
   * @function
   * @param {GameConfig} gameConfig - Game config, requires assetUrl as param
   * @param {GameConfig} mainGameViewRef - the dom element (div) to use for your canvas
   * @param {GameConfig} storeFn - store functions (like redux) { dispatchFn, selectFn }
   * @returns {undefined}
   *
   */
  start(gameConfig, mainGameViewRef, storeFn) {
    engine.assetUrl = "https://s3.ca-central-1.amazonaws.com/dev-assets-1/";
    engine.ui = { ...engine.ui, ...storeFn };

    const options = { antialias: false, transparent: true, resolution: devicePixelRatio };
    const initialDimensions = getDimensions(
      gameConfig.aspectRatio.y / gameConfig.aspectRatio.x,
      getWindow,
    );
    const app = new PIXI.Application(initialDimensions.x, initialDimensions.y, options);
    // scaling
    app.renderer.autoResize = true;
    mainGameViewRef.appendChild(app.view);
    resizeContainers(app, mainGameViewRef, engine);
    if (!gameConfig.disableResponsive) {
      getWindow().onresize = () => {
        resizeContainers(app, mainGameViewRef, engine);
      };
    }
    engine.app = app;
    // engine.ui.dispatch(push('/'));
    return engine.app;
  },
  assetManager,
  sceneManager,
};

engine.utils = utils(engine);

export default engine;
