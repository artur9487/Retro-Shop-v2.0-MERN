/** @format */

import {
	REGISTER_USER_START,
	LOGIN_USER_START,
	SET_CURRENT_USER_END,
	SIGN_OUT,
	LOG_ERROR,
	LOG_ERROR_CLEAN
} from '../types';

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

export const set_current_user_end = (user) => ({
	type: SET_CURRENT_USER_END,
	payload: user
});

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
