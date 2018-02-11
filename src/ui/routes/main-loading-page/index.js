import React from 'react';
import { getImgSrc } from 'utils/img';
import { getSprite } from 'game/engine/asset-manager';

export default function MainLoadingScene() {
  // console.log(getSprite('mainLoading', 'loading-animation'));
  console.log('mainloadingscene');
  return (
    <div className="main-menu">
      <img alt="logo" src={getImgSrc('framework-images/test-loading-1s-200px.svg')} />
      <img alt="logo" src="https://vignette.wikia.nocookie.net/mario/images/8/8c/Mushroom.png" />
      <h2>Welcome to React</h2>
    </div>
  );
}

MainLoadingScene.propTypes = {};
