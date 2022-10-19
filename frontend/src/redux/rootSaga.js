/** @format */

import { all, call } from 'redux-saga/effects';
import AuthSagas from './Auth/sagas';
import productSagas from './Products/sagas';
import UISagas from './UI/sagas';

export default function* rootSaga() {
	yield all([call(productSagas), call(AuthSagas), call(UISagas)]);
}
