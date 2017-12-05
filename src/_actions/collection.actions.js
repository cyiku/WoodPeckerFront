import {collectionConstants} from "../_constants/";
import {collectionService} from "../_services/";
import { alertActions } from './';
import { history } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";

export const collectionActions = {
    getCollection,
    addCollection,
    delCollection,
};

function getCollection(user, type) {

    return dispatch => {
        dispatch(request(user));

        collectionService.getCollection(user, type)
            .then(
                ans => {
                    if(ans.status === 1) {
                        console.log(ans.result.collection);
                        dispatch(success(ans.result.collection, type));
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


    function request(user) { return { type: collectionConstants.GETCOLLECTION_REQUEST, user } }
    function success(collection, dataType) { return {type: collectionConstants.GETCOLLECTION_SUCCESS, collection, dataType} }
    function failure(error) { return { type: collectionConstants.GETCOLLECTION_FAILURE, error } }
}

function addCollection(user, collection, type) {

    return dispatch => {
        dispatch(request(user));
        collectionService.addCollection(user, collection, type)
            .then(
                ans => {
                    if(ans.status === 1) {
                        //console.log(collection);
                        dispatch(success(collection, type));
                        if (type === 'table')
                            openNotificationWithIcon('success', '收藏表格成功');
                        else
                            openNotificationWithIcon('success', '收藏消息成功');
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


    function request(user) { return { type: collectionConstants.ADDCOLLECTION_REQUEST, user } }
    function success(collection, contenttype) {
        return {type: collectionConstants.ADDCOLLECTION_SUCCESS, collection, contenttype}
    }
    function failure(error) { return { type: collectionConstants.ADDCOLLECTION_FAILURE, error } }
}

function delCollection(user, id, type) {

    return dispatch => {
        dispatch(request(user));

        collectionService.delCollection(user, id, type)
            .then(
                ans => {
                    if(ans.status === 1) {
                        dispatch(success(id, type, ans.result.collection));
                        openNotificationWithIcon('success', '取消收藏成功');
                    } else {
                        dispatch(failure(ans.message));
                        dispatch(alertActions.error(ans.result.collection));
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

    function request(user) { return { type: collectionConstants.DELCOLLECTION_REQUEST, user } }
    function success(id, contenttype, contentdata) { return {type: collectionConstants.DELCOLLECTION_SUCCESS, id, contenttype, contentdata} }
    function failure(error) { return { type: collectionConstants.DELCOLLECTION_FAILURE, error } }
}
