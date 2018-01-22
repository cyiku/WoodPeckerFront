import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { openNotificationWithIcon } from "../_helpers";

import './main.css'

class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        } else {
            openNotificationWithIcon("error", "Please input your username or password");
        }
    }

    render() {
        const { username, password} = this.state;
        return (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">

                        <span className="login100-form-title" style={{paddingBottom: 50}}>
                            Woodpecker
                        </span>

                        <form onSubmit={this.handleSubmit}>
                            <div className="wrap-input100">
                                <input className="input100" type="text" placeholder="Username" name="username" value={username} onChange={this.handleChange} />
                            </div>

                            <div className="wrap-input100">
                                <span className="btn-show-pass">
                                    <i className="zmdi zmdi-eye"/>
                                </span>
                                <input className="input100" type="password" placeholder="Password" name="password" value={password} onChange={this.handleChange}/>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"/>
                                    <button className="login100-form-btn">
                                        Login
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="text-center" style={{marginTop: 50}}>
						    <span className="txt1">
							    Don’t have an account?
						    </span>
                            <a className="txt2" href="#">
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 