import * as PIXI from 'pixi.js';
import { Observable } from 'rxjs';
import difference from 'lodash/difference'

import dicts from 'assets';

const assetUrl = process.env.REACT_APP_ASSET_URL;

let loadedDicts = [];

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

export function load({ assets }) {
  return Observable.create((observer) => {
    const notAddedDicts = difference(assets, loadedDicts);
    if (notAddedDicts.length === 0) {
      observer.complete();
      return;
    }
    const combinedDicts = combineDicts(notAddedDicts);
    combinedDicts
      .reduce((loader, { dictName, key, assetName }) =>
        ((loadedDicts.indexOf(dictName) === -1)
          ? loader.add(`${dictName}_${key}`, `${assetUrl}${assetName}`)
          : loader),
        PIXI.loader,
      )
      .on('progress', loader =>
        observer.next({ percentage: parseInt(loader.progress, 10) }),
      )
      .load(() => {
        loadedDicts = loadedDicts.concat(assets);
        observer.complete();
      });
  });
}

export function getSprite(dictName, key) {
  return new PIXI.Sprite(
    PIXI.loader.resources[`${dictName}_${key}`].texture,
  );
}

export default {};
