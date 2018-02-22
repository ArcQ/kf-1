import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import MainMenu from './routes/main-menu';
import LevelOne from './routes/level-one';
import MainLoadingPage from './routes/main-loading-page';

export default function UI(props) {
  return (
    <div className="ui-layer full-screen">
      <ConnectedRouter history={props.history}>
        <Switch>
          <Route exact path="/" component={() => <div />} />
          <Route exact path="/main" component={MainMenu} />
          <Route exact path="/loading/main" component={MainLoadingPage} />
          <Route exact path="/level-one" component={LevelOne} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

UI.propTypes = {
  history: PropTypes.shape({}),
};
