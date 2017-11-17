import { collectionConstants } from '../_constants';

let initialCollection = {
    'weibo': [],
    'news': [],
    'tieba': [],
    'forum': [],
    'pieChart': [],
    'lineChart': [],
    'regionChart': [],
    'tableChart': [],
    };

export function collection(state = initialCollection, action) {
    switch (action.type) {

        case collectionConstants.GETCOLLECTION_REQUEST:
            return state;

        case collectionConstants.GETCOLLECTION_SUCCESS:
            return action.collection;

        case collectionConstants.ADDCOLLECTION_SUCCESS:
            const newcollection = {'data': action.collection, 'id': action.id};
            return state[action.contenttype].concat(newcollection);

        case collectionConstants.DELCOLLECTION_SUCCESS:
            for (let i = 0; i < state[action.contenttype].length; ++i) {
                if (state[action.contenttype][i]['id'] === action.id) {
                    state[action.contenttype].splice(i, 1);
                }
            }
            return state;

        default:
            return state;
    }
}