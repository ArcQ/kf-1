import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import _MainMenu from './routes/main-menu';
import _MainLoadingPage from './routes/main-loading-page';

export const MainMenu = _MainMenu;
export const MainLoadingPage = _MainLoadingPage;

export default function UI(props) {
  return (
    <div className="ui-layer full-screen">
      <ConnectedRouter history={props.history}>
        <Switch>
          <Route exact path="/" component={() => console.log('/') || <div />} />
          <Route exact path="/loading/main" component={MainLoadingPage} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

UI.propTypes = {
  history: PropTypes.string,
};
