import { collectionConstants } from '../_constants';

let initialCollection = {
    'weibo': null,
    'portal': null,
    'agency': null,
    'forum': null,
    'business': null,
    'industry': null,
    'pieChart': null,
    'lineChart': null,
    'regionChart': null,
    'table': null,
};

export function collection(state = initialCollection, action) {
    switch (action.type) {

        case collectionConstants.GETCOLLECTION_REQUEST:
            return state;

        case collectionConstants.GETCOLLECTION_SUCCESS:
            let newState = JSON.parse(JSON.stringify(state));
            newState[action.dataType] = action.collection;
            return newState;

        case collectionConstants.ADDCOLLECTION_SUCCESS:
            newState = JSON.parse(JSON.stringify(state));
            const newcollection = action.collection;
            if (action.contenttype === 'table')
                newState[action.contenttype].push(newcollection);
            else
                newState[action.contenttype].push(newcollection[0]);
            return newState;

        case collectionConstants.DELCOLLECTION_SUCCESS:
            newState = JSON.parse(JSON.stringify(state));
            newState[action.contenttype] = action.contentdata;
            return newState;

        default:
            return state;
    }
}