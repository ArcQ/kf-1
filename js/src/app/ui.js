import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import MainMenu from 'scenes/main-menu/ui';
import MainLoadingPage from 'scenes/loading/main/ui';
import LevelOne from 'scenes/level-one/ui';

export default function UI(props) {
  return (
    <div id="ui" className="ui-layer full-screen">
      <ConnectedRouter history={props.history}>
        <Switch>
          <Route exact path="/main" component={MainMenu} />
          <Route exact path="/loading/main" component={MainLoadingPage} />
          <Route exact path="/level-one" component={LevelOne} />
          <Route exact path="/" component={() => <div />} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

UI.propTypes = {
  history: PropTypes.shape({}),
};
