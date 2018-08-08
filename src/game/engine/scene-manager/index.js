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
 * @property {function=} onFinishLoad - to be fired when scene is ready
 * @property {function=} update - game rendering cycle to be fired every fps
 * @property {function=} [load$] - to be called in parallel with loading scene assets
 * @property {function=} [willLoad] - to be called right before load assets
 */

import { BehaviorSubject, Observable, empty } from 'rxjs';
import {
  concat, map, tap, catchError, takeUntil,
} from 'rxjs/operators';
import { push } from 'react-router-redux';

import { load } from 'game/engine/asset-manager';
import { actions as loadingActions } from 'shared/store/loading/ducks';
import engine from 'game/engine';
import sceneDict from 'game/scenes';

import { createGameLoop } from '../game-loop';
import { update } from '../../scenes/level-one/run';

/**
 * _createLoadObs - creates the observer that first loads the loading scene assets
 then runs the loading scene, then loads the actual scene assets, subscribe to this
 and then run the actual scene
 in parallell it will run load$ if specified inside of the scene definition object
 *
 * @param wrappedScene
 * @returns {Observable}
 */
function _createLoadObs(wrappedScene) {
  const loadingSceneObj = wrappedScene.loading();
  const loadLoadingAssets$ = load(loadingSceneObj);
  const loadSceneAssets$ = load(wrappedScene);
  const sceneCustomLoad$ = wrappedScene.load$ || empty();

  const launchLoadingScene$ = tap(null, null, () => engine.ui.dispatch(push({
    pathname: loadingSceneObj.uiRoute,
    state: { loadingScene: true },
  })));

  const setLoadPercentage$ = map(({ percentage }) => {
    engine.ui.dispatch(
      loadingActions.setLoadPercentage({ percentage }),
    );
    if (wrappedScene.onLoadNext) wrappedScene.onLoadNext();
  });

  const loadAssetPipe$ = loadLoadingAssets$.pipe(
    launchLoadingScene$,
    concat(loadSceneAssets$),
    setLoadPercentage$,
  );

  return Observable.forkJoin(loadAssetPipe$, sceneCustomLoad$).pipe(
    catchError((e) => {
      console.warn(`error in loading scene ${wrappedScene.name}: ${e}`); //eslint-disable-line
      if (wrappedScene.onLoadError) wrappedScene.onLoadError(e);
    }),
  );
}

/**
 * _loadScene function called on every scene change
 * this takes the scene object and loads all assets defined inside of assets attribute
 *
 * @private
 * @param sceneObj
 * @param wrappedScene
 * @returns {undefined}
 */
function _loadScene(wrappedScene) {
  if (wrappedScene.willLoad) wrappedScene.willLoad();

  const loadScene$ = _createLoadObs(wrappedScene);

  loadScene$.subscribe(
    ([ _, sceneCustomRes]) => { //eslint-disable-line
      engine.ui.dispatch(push(wrappedScene.uiRoute));
      wrappedScene.onFinishLoad(sceneCustomRes);
    },
  );
}

let _cancelPrevGameLoopObs;
const _cancelPrevGameLoop$ = new Observable((obs) => {
  _cancelPrevGameLoopObs = obs;
});

/**
 * _wrapInSceneHelpers - wraps a scene with the helper methods so it connects with _loadScene
 *
 * @param sceneObj
 * @returns {SceneDef}
 */
function _wrapInSceneHelpers(sceneObj) {
  const wrappedScene = Object.assign({}, sceneObj, {
    start() {
      // emit event ot cancel previous game loop
      if (_cancelPrevGameLoopObs) _cancelPrevGameLoopObs.next();
      _loadScene(wrappedScene);
    },
    /**
     * onFinishLoad - launches scene def methods and should also launch ui
     * @param sceneCustomRes - response form custom load$ observable supplied in scene def
     * @returns {undefined}
     */
    onFinishLoad(sceneCustomRes) {
      if (sceneObj.onFinishLoad) sceneObj.onFinishLoad(engine.app.stage, sceneCustomRes);
      const gameState$ = new BehaviorSubject({});
      const frames$ = createGameLoop(
        sceneObj.obsList || [],
        sceneObj.update,
        gameState$,
      )
        .pipe(
          takeUntil(_cancelPrevGameLoop$),
        );
      frames$.subscribe();
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
    const sceneObj = sceneDict[sceneKey]();
    const scene = _wrapInSceneHelpers(sceneObj);
    scene.start(engine.app.stage);
  },
};

export default sceneManager;
