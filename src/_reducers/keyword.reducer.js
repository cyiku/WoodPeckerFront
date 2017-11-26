import { keywordConstants } from '../_constants';

export function keyword(state = [], action) {
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
          action.keyword.splice(action.index, 1);
          return action.keyword;

      case keywordConstants.UPDKWS_SUCCESS:
          state[action.index].name = action.keyword.name;
          state[action.index].sites = action.keyword.sites;
          return state;

      default:
        return state;
  }
}