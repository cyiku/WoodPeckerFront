import { websocketConstants } from '../_constants';

export function myWebsocket(state = {}, action) {
    switch (action.type) {
        case websocketConstants.CONNECT_REQUEST:
            return { connection: action.connection };
        default:
            return state;
    }
}