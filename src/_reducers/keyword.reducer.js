import { keywordConstants } from '../_constants';

export function keyword(state = null, action) {
  switch (action.type) {

      case keywordConstants.GETKWS_REQUEST:
          //alert('request');
          return state;

      case keywordConstants.GETKWS_SUCCESS:
          //alert('success');
          for (let i = 0; i < action.keyword.length; ++i) {
              action.keyword[i].sites = action.keyword[i].sites.split(';');
          }
        return action.keyword;

      case keywordConstants.ADDKWS_SUCCESS:
          action.keyword = state.concat(action.newword);
          return action.keyword;

      case keywordConstants.DELKWS_SUCCESS:
          let newState = JSON.parse(JSON.stringify(state));
          newState.splice(action.index, 1);
          return newState;

      case keywordConstants.UPDKWS_SUCCESS:
          state[action.index].name = action.keyword.name;
          state[action.index].sites = action.keyword.sites;
          return state;

      default:
        return state;
  }
}