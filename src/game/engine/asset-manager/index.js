import * as PIXI from 'pixi.js';
import dicts from 'assets';

const assetUrl = process.env.REACT_APP_ASSET_URL;

function combineDicts(requiredDicts) {
  const combinedDict = requiredDicts.reduce((_combinedDict, dictName) => {
    const curDict = Object.keys(
      dicts[dictName]).map(key =>
        ({ dictName, key, assetName: dicts[dictName][key] }),
      );
    return Object.assign(_combinedDict, curDict);
  }, []);
  return combinedDict;
}

function onFinishLoad(resources, resolve) {
  resolve(true);
}

function loadProgressHandler(loader, resource) {

  // Display the file `url` currently being loaded
  console.log("loading: " + resource.url);

  // Display the percentage of files currently loaded
  console.log("progress: " + loader.progress + "%");
}

export function load(assetsList) {
  return new Promise((resolve) => {
    const combinedDicts = combineDicts([assetsList]);
    combinedDicts
      .reduce((loader, { dictName, key, assetName }) =>
        loader.add(`${dictName}_${key}`, `${assetUrl}${assetName}`), PIXI.loader,
      )
      .on('progress', loadProgressHandler)
      .load((loader, resources) => onFinishLoad(resources, resolve));
  });
}

export function getSprite(dictName, key) {
  return new PIXI.Sprite(
    PIXI.loader.resources[`${dictName}_${key}`].texture,
  );
}

export default {};
