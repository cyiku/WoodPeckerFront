import {collectionConstants} from "../_constants/";
import {collectionService} from "../_services/";
import { alertActions } from './';
import { history } from '../_helpers';

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
                    if(ans.status) {
                        dispatch(success(ans.collection, type));
                    } else {
                        dispatch(failure(ans.reason));
                        dispatch(alertActions.error(ans.reason));
                        alert(ans.reason);
                        if (ans.logout)
                        history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    alert("服务器内部错误,请联系管理员,抱歉！");
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
                    if(ans.status) {
                        dispatch(success(collection, type));
                    } else {
                        dispatch(failure(ans.reason));
                        dispatch(alertActions.error(ans.reason));
                        alert(ans.reason);
                        if (ans.logout)
                        history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    alert("服务器内部错误,请联系管理员,抱歉！");
                    history.push("/login");
                }
            );
    };


    function request(user) { return { type: collectionConstants.ADDCOLLECTION_REQUEST, user } }
    function success(collection, contenttype) { return {type: collectionConstants.ADDCOLLECTION_SUCCESS, collection, contenttype} }
    function failure(error) { return { type: collectionConstants.ADDCOLLECTION_FAILURE, error } }
}

function delCollection(user, id, type) {

    return dispatch => {
        dispatch(request(user));

        collectionService.delCollection(user, id, type)
            .then(
                ans => {
                    if(ans.status) {
                        dispatch(success(id, type, ans.collection));
                    } else {
                        dispatch(failure(ans.reason));
                        dispatch(alertActions.error(ans.collection));
                        alert(ans.reason);
                        if (ans.logout)
                        history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    alert("服务器内部错误,请联系管理员,抱歉！");
                    history.push("/login");
                }
            );
    };

    function request(user) { return { type: collectionConstants.DELCOLLECTION_REQUEST, user } }
    function success(id, contenttype, contentdata) { return {type: collectionConstants.DELCOLLECTION_SUCCESS, id, contenttype, contentdata} }
    function failure(error) { return { type: collectionConstants.DELCOLLECTION_FAILURE, error } }
}
