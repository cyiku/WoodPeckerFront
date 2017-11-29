import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";

export const userActions = {
    login,
    logout,
    //register,
};

function login(username, password) {

    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    if (user && user.token) {
                        localStorage.setItem('user', JSON.stringify(user));
                        dispatch(success(user));
                        openNotificationWithIcon("success", "Hi " + user.username);
                        history.push('/');
                    } else {
                        alert("账号或密码输入错误！");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    alert("服务器内部错误,请联系管理员,抱歉！");
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    //openNotificationWithIcon("success", "bye bye");
    return { type: userConstants.LOGOUT };
}
