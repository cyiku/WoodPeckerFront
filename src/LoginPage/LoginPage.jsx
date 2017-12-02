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
            //let data = document.querySelector('form');
            //console.log(data);
            //dispatch(userActions.login2(username, data));
        } else {
            alert("Please input your username or password");
        }
    }

    componentWillMount() {
        document.body.className = "bg-dark"
    }

    render() {
        const { username, password} = this.state;
        return (

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