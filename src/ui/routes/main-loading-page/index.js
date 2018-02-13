import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors as loadingSelectors } from 'shared/store/loading/ducks';

import { getImgSrc } from 'utils/img';

function MainLoadingScene(props) {
  return (<div className="main-menu">
    <img alt="logo" src={getImgSrc('framework-images/test-loading-1s-200px.svg')} />
    <h1 className="f1"> Loading... {props.loadingPercentage} % </h1>
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
