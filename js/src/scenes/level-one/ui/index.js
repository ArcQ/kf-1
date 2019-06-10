import React from 'react';
import PropTypes from 'prop-types';
import { wrapInPauseMenu } from 'utils/recompose';
import { AttackButton } from './components/ActionButtons';

function LevelOne(props) {
  return props.isPaused
    ? <div className="ui-layer">
      <h1 className="f1">
        Paused
      </h1>
    </div>
    : <AttackButton id="attackOneBtn">attack</AttackButton>;
}

LevelOne.propTypes = {
  isPaused: PropTypes.bool,
};

export default wrapInPauseMenu(LevelOne);
