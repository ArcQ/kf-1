import { load } from '../engine/asset-manager';

function loadAssets(sceneObj) {
  return Promise.all(
    sceneObj.assets.map(dictKey => load(dictKey)),
  );
}

export default function wrapInSceneHelpers(sceneObj) {
  const wrappedScene = Object.assign({}, sceneObj, {
    start() {
      loadAssets(sceneObj).then(wrappedScene.onFinishLoad);
    },
  });
  return wrappedScene;
}
