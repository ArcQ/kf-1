/**
 *
 * Scene Manager that manages loading scene assets, loading screens and runs scene
 *
 * @example <caption>To Start scene manager called inside initPixi.</caption>
 * sceneManager.start(config.game, gameViewRef, store)
 *

 * @example <caption>To push scene use pushScene</caption>
 * sceneManager.pushScene("testScene")
 *
 * @example <caption>Define a scene def, making sure you define
 asset keys inside of assets index.js</caption>
 *
 * export default {
 *   name: 'level-one-scene',
 *   loading: mainLoadingScene,
 *   uiRoute: '/level-one',
 *   assets: ['levelOne', 'goblins'],
 *   willLoad() {
 *     request('/gamemap/generate').subscribe(
 *       (data) => console.log(data),
 *     );
 *   },
 *   onTick() {
 *     // anim.rotation += 0.01;
 *   },
 *   onFinishLoad(stage) {
 *     // create an array of textures from an image path
 *     const goblin = createGoblin();
 *     stage.addChild(goblin);
 *
 *     const tile = createTile();
 *     stage.addChild(tile);
 *   },
 * };


 * @module game/engine/scene-manager
 *
 */

/**
 * scene definition object
 * @typedef {Object} SceneDef
 * @property {string} name - name of scene
 * @property {SceneDef} loading - another scene to be used while loading assets,
 scenes will load assets while running loading scene
 * @property {string[]} assets - assets dictionary to use to match keys inside of assets/index.js
 * @property {function=} willLoad - to be called right before load assets
 * @property {function=} onFinishLoad - to be fired when scene is ready
 * @property {function=} onTick - game rendering cycle to be fired every fps
 */

import { push } from 'react-router-redux';

import engine from 'game/engine';
import { load } from 'game/engine/asset-manager';
import sceneDict from 'game/scenes';

import { actions as loadingActions } from 'shared/store/loading/ducks';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/delay';

/**
 * _loadScene function called on every scene change
 * this takes the scene object and loads all assets defined inside of assets attribute
 *
 * @private
 * @param sceneObj
 * @param wrappedScene
 * @returns {undefined}
 */
function _loadScene(sceneObj, wrappedScene) {
  const loadingSceneObj = sceneObj.loading;
  console.log(loadingSceneObj);
  const loadLoadingAssets$ = load(loadingSceneObj);
  const loadSceneAssets$ = load(sceneObj);

  wrappedScene.willLoad();

  loadLoadingAssets$
    .do(null, null, () => engine.ui.dispatch(push({
      pathname: loadingSceneObj.uiRoute,
      state: { loadingScene: true },
    })))
    .concat(loadSceneAssets$)
    .map(({ percentage }) => {
      engine.ui.dispatch(
        loadingActions.setLoadPercentage({ percentage }),
      );
      if (wrappedScene.onLoadNext) wrappedScene.onLoadNext();
    })
    .subscribe(
      undefined,
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

function _wrapInSceneHelpers(sceneObj) {
  const wrappedScene = Object.assign({}, sceneObj, {
    start() {
      _loadScene(sceneObj, wrappedScene);
    },
    onFinishLoad() {
      console.log(`finished loading ${sceneObj.name}`); //eslint-disable-line
      sceneObj.onFinishLoad(engine.app.stage);
    },
  });
  return wrappedScene;
}

/** @namespace sceneManager * */
const sceneManager = {
  /**
   * starts the scene manager with a default scene as specified in the config
   *
   * @function
   * @param {GameConfig} config - A color, in hexadecimal format.
   * @returns {undefined}
   *
   */
  start(config) {
    sceneManager.pushScene(config.defaultScene);
  },
  /**
   * pushes another scene
   *
   * @function
   * @param {string} sceneKey - key of the scene defined in scenes/index namespace
   * @returns {undefined}
   *
   */
  pushScene(sceneKey) {
    const scene = _wrapInSceneHelpers(sceneDict[sceneKey]);
    scene.start(engine.app.stage);
  },
};

export default sceneManager;
