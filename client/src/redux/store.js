import {createStore} from "redux";
import {reducer} from './combineReducers';

const store = createStore(reducer);

export default store;