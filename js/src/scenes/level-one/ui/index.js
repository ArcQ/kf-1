import React from 'react';
import PropTypes from 'prop-types';
import { wrapInPauseMenu } from 'utils/recompose';
import { AttackButton, StopButton } from './components/ActionButtons';

function LevelOne(props) {
  return props.isPaused
    ? <div className="ui-layer">
      <h1 className="f1">
        Paused
      </h1>
    </div>
    : <div>
      <AttackButton id="attackOneBtn">attack</AttackButton>
      <StopButton id="stopBtn">stop</StopButton>
    </div>;
}

LevelOne.propTypes = {
  isPaused: PropTypes.bool,
};

export default wrapInPauseMenu(LevelOne);
