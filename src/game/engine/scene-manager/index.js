import { push } from 'react-router-redux';

import engine from 'game/engine';
import { load } from 'game/engine/asset-manager';
import sceneDict from 'game/scenes';

import { actions as loadingActions } from 'shared/store/loading/ducks';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/delay';

function loadScene(sceneObj, wrappedScene) {
  const loadingSceneObj = sceneObj.loading;
  const loadLoadingAssets$ = load(loadingSceneObj);
  const loadSceneAssets$ = load(sceneObj);

  loadLoadingAssets$
    .do(null, null, () => engine.ui.dispatch(push(loadingSceneObj.uiRoute)))
    .concat(loadSceneAssets$)
    .delay(5000)
    .subscribe(
      ({ name, loader, resource }) => {
        console.log(`loading ${resource.name}`); //eslint-disable-line
        engine.ui.dispatch(
          loadingActions.setLoadPercentage({ name, percentage: loader.progress }),
        );
        if (wrappedScene.onLoadNext) wrappedScene.onLoadNext();
        engine.app.ticker.add(wrappedScene.onTick);
      },
      (e) => {
        if (wrappedScene.onLoadError) wrappedScene.onLoadError(e);
      },
      () => {
        engine.ui.dispatch(push(sceneObj.uiRoute));
        wrappedScene.onFinishLoad();
        engine.app.ticker.add(wrappedScene.onTick);
      },
    );
}

function wrapInSceneHelpers(sceneObj) {
  const wrappedScene = Object.assign({}, sceneObj, {
    start() {
      loadScene(sceneObj, wrappedScene);
    },
    onFinishLoad() {
      console.log(`finished loading ${sceneObj.name}`); //eslint-disable-line
      sceneObj.onFinishLoad(engine.app.stage);
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
