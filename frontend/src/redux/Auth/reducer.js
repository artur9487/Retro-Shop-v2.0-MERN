/** @format */

import { SET_CURRENT_USER_END, LOG_ERROR, LOG_ERROR_CLEAN } from '../types';

const INITIAL_STATE = {
	user: null,
	logError: null
};

const AuthReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_USER_END:
			return { ...state, user: action.payload };
		case LOG_ERROR:
			return { ...state, logError: action.payload };
		case LOG_ERROR_CLEAN:
			return { ...state, logError: null };
		default:
			return state;
	}
};

export default AuthReducer;
