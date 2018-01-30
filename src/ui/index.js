import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import _MainMenu from './routes/main-menu';
import _MainLoadingPage from './routes/main-loading-page';

const history = createBrowserHistory();

export const MainMenu = _MainMenu;
export const MainLoadingPage = _MainLoadingPage;

export default function UI() {
  return (
    <div className="ui-layer full-screen">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={MainMenu} />
          <Route exact path="/main-loading-scene" component={MainLoadingPage} />
        </Switch>
      </Router>
    </div>
  );
}

UI.propTypes = {
  type: PropTypes.string,
};
