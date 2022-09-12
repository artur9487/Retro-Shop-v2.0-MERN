/** @format */

import { combineReducers } from 'redux';
import AuthReducer from './Auth/reducer';
import { productsReducer } from './Products/reducer';
import UIReducer from './UI/reducer';

export const rootReducer = combineReducers({
	productsData: productsReducer,
	UIData: UIReducer,
	AuthData: AuthReducer
});

export default rootReducer;
