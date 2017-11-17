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
                        dispatch(success(ans.collection));
                    } else {
                        dispatch(failure(ans.reason));
                        dispatch(alertActions.error(ans.reason));
                        alert(ans.reason);
                        history.push("/login");
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    alert("服务器内部错误,请联系管理员,抱歉！");
                    history.push("/login");
                }
            )
        ;
    };


    function request(user) { return { type: collectionConstants.GETCOLLECTION_REQUEST, user } }
    function success(collection) { return {type: collectionConstants.GETCOLLECTION_SUCCESS, collection} }
    function failure(error) { return { type: collectionConstants.GETCOLLECTION_FAILURE, error } }
}

function addCollection(user, collection, type) {

    return dispatch => {
        dispatch(request(user));
        collectionService.addCollection(user, collection, type)
            .then(
                ans => {
                    if(ans.status) {
                        console.log(ans);
                        dispatch(success(collection, ans.collectionid, type));
                    } else {
                        dispatch(failure(ans.reason));
                        dispatch(alertActions.error(ans.reason));
                        alert(ans.reason);
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
    function success(collection, collectionid, contenttype) { return {type: collectionConstants.ADDCOLLECTION_SUCCESS, collection, collectionid, contenttype} }
    function failure(error) { return { type: collectionConstants.ADDCOLLECTION_FAILURE, error } }
}

function delCollection(user, id, type) {

    return dispatch => {
        dispatch(request(user));
        collectionService.delCollection(user, id)
            .then(
                ans => {
                    if(ans.status) {
                        dispatch(success(id));
                    } else {
                        dispatch(failure(ans.reason));
                        dispatch(alertActions.error(ans.reason));
                        alert(ans.reason);
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
    function success(id, type) { return {type: collectionConstants.DELCOLLECTION_SUCCESS, id, type} }
    function failure(error) { return { type: collectionConstants.DELCOLLECTION_FAILURE, error } }
}
