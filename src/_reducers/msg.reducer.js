import { MsgConstants } from '../_constants';

export function msg(state = {}, action) {
  switch (action.type) {

      case MsgConstants.GETMSG_REQUEST:
          //alert('request');
          return state;

      case MsgConstants.GETMSG_SUCCESS:
          //alert('success');
            if (state[action.keyword] !== undefined)
                return state[action.keyword]
            else 
                return [];

      case MsgConstants.UPDMSG_REQUEST:
          //alert('request');
          return state;

      case MsgConstants.UPDMSG_SUCCESS:
          console.log(action);
          state[action.keyword] = action.msg;
          return state;

      default:
        return state;
  }
}