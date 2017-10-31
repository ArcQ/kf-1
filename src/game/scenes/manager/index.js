import engine from 'game/engine';
import { load } from 'game/asset-manager';
import sceneDict from '../templates';

function loadAssets(sceneObj) {
  return Promise.all(
    sceneObj.assets.map(dictKey => load(dictKey)),
  );
}

function wrapInSceneHelpers(sceneObj) {
  const wrappedScene = Object.assign({}, sceneObj, {
    start() {
      loadAssets(sceneObj).then(() => {
        wrappedScene.onFinishLoad(engine.app.stage);
        engine.app.ticker.add(wrappedScene.onTick);
      });
    },
    onFinishLoad(stage) {
      console.log(`finished loading ${sceneObj.name}`);
      sceneObj.onFinishLoad(stage);
    },
  });
  return wrappedScene;
}

const sceneManager = {
  start(config) {
    sceneManager.pushScene(config.defaultScene);
  },
  pushScene(sceneKey) {
    const scene = wrapInSceneHelpers(sceneDict[sceneKey]);
    scene.start(engine.app.stage);
  },
};

export default sceneManager;
