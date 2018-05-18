import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { alert } from './alert.reducer';
import {keyword} from "./keyword.reducer";
import {collection} from "./collection.reducer";
import {msg} from './msg.reducer';
const rootReducer = combineReducers({
  authentication,
  alert, keyword, collection, msg
});

export default rootReducer;