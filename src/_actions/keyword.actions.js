import {keywordConstants} from "../_constants/";
import {keywordService} from "../_services/";
import { alertActions } from './';
import { history } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";

export const keywordActions = {
    getKws,
    addKws,
    delKws,
    updKws,
};

function getKws(user) {

    return dispatch => {
        dispatch(request(user));
        keywordService.getKws(user)
            .then(
                ans => {
                    if(ans.status === 1) {
                        dispatch(success(ans.result.keyword));
                    } else {
                        dispatch(failure(ans.message));
                        dispatch(alertActions.error(ans.message));
                        alert(ans.message);
                        if (ans.status === -1)
                            history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    if (error.message === "Failed to fetch") {
                        alert("登录过期, 请重新登录");
                    } else {
                        alert("服务器内部错误,请联系管理员,抱歉！");
                    }
                    history.push("/login");
                }
            )
        ;
    };


    function request(user) { return { type: keywordConstants.GETKWS_REQUEST, user } }
    function success(keyword) { return {type: keywordConstants.GETKWS_SUCCESS, keyword} }
    function failure(error) { return { type: keywordConstants.GETKWS_FAILURE, error } }
}

function addKws(user, newkeyword) {

    return dispatch => {
        dispatch(request(user));
        keywordService.addKws(user, newkeyword)
            .then(
                ans => {
                    if(ans.status === 1) {
                        //console.log(ans);
                        newkeyword.keywordid = ans.result.keywordid;
                        dispatch(success(newkeyword));
                        openNotificationWithIcon('success', '添加关键字成功');
                    } else {
                        dispatch(failure(ans.message));
                        dispatch(alertActions.error(ans.message));
                        alert(ans.message);
                        if (ans.status === -1)
                        history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    if (error.message === "Failed to fetch") {
                        alert("登录过期, 请重新登录");
                    } else {
                        alert("服务器内部错误,请联系管理员,抱歉！");
                    }
                    history.push("/login");
                }
            );
    };


    function request(user) { return { type: keywordConstants.ADDKWS_REQUEST, user } }
    function success(newword) { return {type: keywordConstants.ADDKWS_SUCCESS, newword} }
    function failure(error) { return { type: keywordConstants.ADDKWS_FAILURE, error } }
}

function delKws(user, keyword, index) {

    return dispatch => {
        dispatch(request(user));
        keywordService.delKws(user, keyword, index)
            .then(
                ans => {
                    if(ans.status === 1) {
                        dispatch(success(keyword, index));
                        openNotificationWithIcon('success', '删除关键字成功', '');
                        history.push("/keywords");
                    } else {
                        dispatch(failure(ans.message));
                        dispatch(alertActions.error(ans.message));
                        alert(ans.message);
                        if (ans.status === -1)
                        history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    if (error.message === "Failed to fetch") {
                        alert("登录过期, 请重新登录");
                    } else {
                        alert("服务器内部错误,请联系管理员,抱歉！");
                    }
                    history.push("/login");
                }
            );
    };

    function request(user) { return { type: keywordConstants.DELKWS_REQUEST, user } }
    function success(keyword, index) { return {type: keywordConstants.DELKWS_SUCCESS, keyword, index} }
    function failure(error) { return { type: keywordConstants.DELKWS_FAILURE, error } }
}

function updKws(user, newkeyword, index, keywordid) {

    return dispatch => {
        dispatch(request(user));
        keywordService.updKws(user, newkeyword, keywordid)
            .then(
                ans => {
                    if(ans.status === 1) {
                        dispatch(success(newkeyword, index));
                        openNotificationWithIcon('success', '更新关键字成功', '');
                        history.push("/keywords");
                    } else {
                        dispatch(failure(ans.message));
                        dispatch(alertActions.error(ans.message));
                        alert(ans.message);
                        if (ans.status === -1)
                            history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    if (error.message === "Failed to fetch") {
                        alert("登录过期, 请重新登录");
                    } else {
                        alert("服务器内部错误,请联系管理员,抱歉！");
                    }
                    history.push("/login");
                }
            );
    };

    function request(user) { return { type: keywordConstants.UPDKWS_REQUEST, user } }
    function success(keyword, index) { return {type: keywordConstants.UPDKWS_SUCCESS, keyword, index} }
    function failure(error) { return { type: keywordConstants.UPDKWS_FAILURE, error } }
}