import { MsgConstants } from "../_constants/";
// import { alertActions } from './';
// import { history } from '../_helpers';
// import { openNotificationWithIcon } from "../_helpers";
// import {userActions} from '../_actions';
// import {errorProcess} from "../_helpers/error";

export const MsgActions = {
    getMsg,
    updMsg,
};

function getMsg(user, keyword) {

    return dispatch => {
        dispatch(request(user));
        dispatch(success(keyword));
    };


    function request(user) { return { type: MsgConstants.GETMSG_REQUEST, user } }
    function success(keyword) { return {type: MsgConstants.GETMSG_SUCCESS, keyword} }
}


function updMsg(user, keyword, msg) {

    return dispatch => {
        dispatch(request(user));
        dispatch(success(keyword, msg));
    };

    function request(user) { return { type: MsgConstants.UPDMSG_REQUEST, user } }
    function success(keyword, msg) { return {type: MsgConstants.UPDMSG_SUCCESS, keyword, msg} }
}