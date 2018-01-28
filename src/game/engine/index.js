import * as PIXI from 'pixi.js';
import { getWindow, getDocument, devicePixelRatio } from 'core/utils/global';
import scaleToWindowPixi from 'scale-to-window-pixi';

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
}

const engine = {
  app: null,
  store: null,
  bounds: null,
  scale: null,
  redux: {
    dispatch(action) {
      this.store.dispatch(action);
    },
    select(key) {
      return engine.app.store[key];
    },
  },
  start(gameConfig, mainGameViewRef, store) {
    engine.store = store;
    const options = { antialias: false, transparent: false, resolution: devicePixelRatio };
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
      window.onresize = () => {
        resizeContainers(app, mainGameViewRef, engine);
      };
    }
    engine.app = app;
    return engine.app;
  },
};

export default engine;
