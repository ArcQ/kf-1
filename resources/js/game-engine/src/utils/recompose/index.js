import { lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { actions as gameActions, selectors as gameSelectors } from 'shared/store/game/ducks';

export function shouldNeverUpdate(component) {
  return lifecycle({
    shouldComponentUpdate() { return false; },
  })(component);
}

export function wrapInPauseMenu(component) {
  const mapDispatchToProps = {
    setPaused: gameActions.setPaused,
  };
  const mapStateToProps = state => ({
    isPaused: gameSelectors.isPaused(state),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(component);
}

export default {};
