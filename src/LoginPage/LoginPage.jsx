import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css'
import '../vendor/font-awesome/css/font-awesome.min.css'

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
            alert("Please input your username or password");
        }
    }

    componentWillMount() {
        document.body.className = "bg-dark"
    }

    render() {
        //const { loggingIn } = this.props;
        const { username, password} = this.state;
        return (
            /*
            <div className="col-md-6 col-md-offset-3">
                <h2>Login</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                        <Link to="/register" className="btn btn-link">Register</Link>
                    </div>
                </form>
            </div>
            */
            <div className="container">
                <div className="card card-login mx-auto mt-5">
                    <div className="card-header">登录</div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label>用户名</label>
                                <input className="form-control" placeholder="Username" name="username" value={username} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>密码</label>
                                <input className="form-control" type="password" placeholder="Password" name="password" value={password} onChange={this.handleChange} />
                            </div>
                            <button className="btn btn-primary btn-block">登录</button>
                        </form>
                        {/*
                        <div className="text-center">
                            <Link className="d-block small mt-3" to="/register">注册账号</Link>
                        </div>
                        */}
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