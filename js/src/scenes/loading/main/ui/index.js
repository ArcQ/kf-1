import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors as loadingSelectors } from 'store/loading/ducks';

import engine from 'kf-game-engine';

function MainLoadingScene(props) {
  return (
    <div className="ui-layer">
      <img
        alt="logo"
        src={
          engine.helperMethods
            && engine.helperMethods.getImgSrc('framework-images/test-loading-1s-200px.svg')
        }
      />
      <h1 className="f1">
        {' '}
        Loading...
        {props.loadingPercentage}
        {' '}
        %
        {' '}
      </h1>
    </div>
  );
}

MainLoadingScene.propTypes = {
  loadingPercentage: PropTypes.number,
};

const mapStateToProps = state => ({
  loadingPercentage: loadingSelectors.loadingPercentage(state),
});

export default connect(
  mapStateToProps,
  undefined,
)(MainLoadingScene);
