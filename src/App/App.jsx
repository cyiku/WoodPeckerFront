import React from 'react';
import { Router, Route,Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { PrivateRoute } from '../_components/PrivateRoute';

class App extends React.Component {
    /*
    constructor(props) {
        super(props);
        // const { dispatch } = this.props;
    }
    */

    render() {

        // const { alert } = this.props;

        return (
                <Router history={history}>
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        {/*<Route path="/" component={HomePage} onEnter={this.isLogin}/>*/}
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