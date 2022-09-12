/** @format */

import { takeLatest, put, all, call } from 'redux-saga/effects';
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signOut
} from 'firebase/auth';
import { LOGIN_USER_START, REGISTER_USER_START, SIGN_OUT } from '../types';
import { set_current_user_end, log_error } from './actions';

//---------------------REGISTER THE USER---------------------
export function* registerUserStart({ payload }) {
	const auth = getAuth();
	const { email, password } = payload;
	try {
		yield createUserWithEmailAndPassword(auth, email, password);
		yield put(set_current_user_end());
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
	const auth = getAuth();
	const { email, password } = payload;
	try {
		yield signInWithEmailAndPassword(auth, email, password);
		yield put(set_current_user_end());
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
	const auth = getAuth();
	try {
		yield signOut(auth);
		yield put(set_current_user_end());
	} catch (err) {
		console.log(err);
	}
}

export function* onSignOut() {
	yield takeLatest(SIGN_OUT, signOutt);
}
//----------------ALL SAGAS-------------------------------------
export default function* AuthSagas() {
	yield all([
		call(onRegisterUserStart),
		call(onLoginUserStart),
		call(onSignOut)
	]);
}
