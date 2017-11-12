import React from 'react';
import { Router, Route,Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { PrivateRoute } from '../_components/PrivateRoute';

class App extends React.Component {

    render() {

        return (
                <Router history={history}>
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <PrivateRoute path='/' component={HomePage}/>
                    </Switch>
                </Router>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 