/** @format */

import { takeLatest, put, all, call } from 'redux-saga/effects';
import { LOGIN_USER_START, REGISTER_USER_START, SIGN_OUT } from '../types';
import { set_current_user_end, log_error } from './actions';
import axios from 'axios';

//---------------------REGISTER THE USER---------------------
export function* registerUserStart({ payload }) {
	const { email, password } = payload;
	try {
		const response = yield axios.post('http://localhost:5000/Register', {
			email: email,
			password: password
		});

		const { user, token } = response.data;
		setAuthorizationHeader(user, token);
		yield put(set_current_user_end(user));
	} catch (error) {
		const errorMessage = error.message;
		yield put(log_error(errorMessage));
	}
}

export function* onRegisterUserStart() {
	yield takeLatest(REGISTER_USER_START, registerUserStart);
}
//----------------------LOGIN THE USER----------------------
export function* loginUserStart({ payload }) {
	const { email, password } = payload;

	try {
		const response = yield axios.post('http://localhost:5000/Login', {
			email: email,
			password: password
		});

		const { user, token } = response.data;

		setAuthorizationHeader(user, token);
		yield put(set_current_user_end(user));
	} catch (error) {
		const errorMessage = error.message;
		yield put(log_error(errorMessage));
	}
}

export function* onLoginUserStart() {
	yield takeLatest(LOGIN_USER_START, loginUserStart);
}

//-------------------------SIGN OUT THE USER-----------------------
export function* signOutt() {
	try {
		localStorage.removeItem('FBIdToken');
		localStorage.removeItem('user');
		delete axios.defaults.headers.common['Authorization'];
		yield put(set_current_user_end(null));
	} catch (err) {
		console.log(err);
	}
}

export function* onSignOut() {
	yield takeLatest(SIGN_OUT, signOutt);
}
//----------------ALL SAGAS-------------------------------------
const setAuthorizationHeader = (userArg, tokenArg) => {
	const FBIdToken = `Bearer ${tokenArg}`;
	localStorage.setItem('FBIdToken', FBIdToken);
	localStorage.setItem('user', userArg.email);
	axios.defaults.headers.common['Authorization'] = FBIdToken;
};

export default function* AuthSagas() {
	yield all([
		call(onRegisterUserStart),
		call(onLoginUserStart),
		call(onSignOut)
	]);
}
