import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { alert } from './alert.reducer';
import {keyword} from "./keyword.reducer";

const rootReducer = combineReducers({
  authentication,
  alert, keyword
});

export default rootReducer;