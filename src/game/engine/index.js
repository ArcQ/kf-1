import * as PIXI from 'pixi.js';

const engine = {
  app: null,
  start() {
    engine.app = new PIXI.Application();
    return engine.app;
  },
};

export default engine;
