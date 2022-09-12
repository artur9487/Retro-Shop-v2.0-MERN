/** @format */

import {
	REGISTER_USER_START,
	LOGIN_USER_START,
	SET_CURRENT_USER_END,
	SIGN_OUT,
	LOG_ERROR,
	LOG_ERROR_CLEAN
} from '../types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

//--------------------REGISTER ACTION SENDING TO SAGA-------------------
export const register_user_start = (email, password) => ({
	type: REGISTER_USER_START,
	payload: { email, password }
});

//--------------------LOGIN ACTION SENDING TO SAGA-------------------
export const login_user_start = (email, password) => ({
	type: LOGIN_USER_START,
	payload: { email, password }
});

//--------------------SETTING THE CURRENT USER SENDING TO REDUCER-------------------
export const set_current_user_end = () => (dispatch) => {
	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {
			console.log('user log in');
			dispatch({ type: SET_CURRENT_USER_END, payload: user });
		} else {
			console.log('user not log in');
			dispatch({ type: SET_CURRENT_USER_END, payload: null });
		}
	});
};

//--------------------SENDING SIGN OUT TO REDUCER-------------------
export const sign_out = {
	type: SIGN_OUT
};

//--------------------LOGGING OR REGISTRATION VALIDATION ERRORS FROM SAGA TO REDUCER-------------------
export const log_error = (err) => ({
	type: LOG_ERROR,
	payload: err
});

//---------------------CLEANING THE LOGGING AND REGISTRATION ERRORS TO REDUCER-------------------
export const log_error_clean = {
	type: LOG_ERROR_CLEAN
};
