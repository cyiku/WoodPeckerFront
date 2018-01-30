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
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(success(user));
                    openNotificationWithIcon("success", "Hi " + username);
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    if (typeof error === "object")
                        openNotificationWithIcon("error", "请检查您的网络");
                    else
                        openNotificationWithIcon("error", "您无权访问，请检查账号密码");
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
