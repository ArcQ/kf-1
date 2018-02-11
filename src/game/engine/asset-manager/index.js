import * as PIXI from 'pixi.js';
import { Observable } from 'rxjs';

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


export function load({ assets, name }) {
  return Observable.create((observer) => {
    const combinedDicts = combineDicts(assets);
    combinedDicts
      .reduce((loader, { dictName, key, assetName }) =>
        loader.add(`${dictName}_${key}`, `${assetUrl}${assetName}`), PIXI.loader,
      )
      .on('progress', (loader, resource) => console.log('load') || observer.next({ name, loader, resource }))
      .load(() => {
        console.log('complete');
        loadedDicts = loadedDicts.concat(assets);
        observer.complete();
      });
  });
}

export function getSprite(dictName, key) {
  console.log('resources', PIXI.loader.resources);
  return new PIXI.Sprite(
    PIXI.loader.resources[`${dictName}_${key}`].texture,
  );
}

export default {};
