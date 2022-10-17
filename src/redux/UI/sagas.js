/** @format */

import { takeLatest, put, all, call } from 'redux-saga/effects';
import axios from 'axios';
import { SET_COMMENT_START, FETCH_COMMENT_START, SET_MARKED } from '../types';

import {
	fetch_comments_end,
	fetch_comments_start,
	fetch_notyfication_end
} from './actions';
import { fetch_products } from '../Products/actions';

//-------------SETTING THE COMMENT-------------
export function* setCommentStart({ payload }) {
	const { obj, user, pageInfo } = payload;
	const { productID } = obj;
	const { limit, page } = pageInfo;

	try {
		yield axios
			.post(`http://localhost:5000/logged/${user.email}/${productID}`, obj)
			.then(() => console.log('Comment notyfication added'));

		yield put(fetch_comments_start(productID));
		yield put(fetch_products(limit, page));
	} catch (err) {
		console.log(err);
	}
}

export function* onSetCommentStart() {
	yield takeLatest(SET_COMMENT_START, setCommentStart);
}

//-----------FETCHING THE COMMENTS----------------
export function* fetchCommentsStart({ payload }) {
	try {
		let comments;
		const { productID, user } = payload;
		if (user) {
			const response = yield axios.get(
				`http://localhost:5000/logged/${user.email}/${productID}`
			);

			comments = response.data;
		} else {
			const response = yield axios.get(`http://localhost:5000/${productID}`);

			comments = response.data;
		}

		yield put(fetch_comments_end(comments));
	} catch (err) {
		console.log(err);
	}
}
export function* onFetchCommentsStart() {
	yield takeLatest(FETCH_COMMENT_START, fetchCommentsStart);
}

//-----------------SETTING THE RIGHT DATA OF THE NOTYFICATION DATA WHICH WERE READ--
export function* setMarked({ payload }) {
	const { notIdsOrders, notIdsComments, receiver } = payload;

	let endpoints = [
		`http://localhost:5000/logged/${receiver}/notyfications`,
		`http://localhost:5000/logged/${receiver}/yourProduct/notyfications`,
		`http://localhost:5000/logged/${receiver}/personalData/notyfications`
	];

	try {
		const notyfications = yield axios.all(
			endpoints.map((endpoint) =>
				axios.put(endpoint, {
					notIdsOrders: notIdsOrders,
					notIdsComments: notIdsComments
				})
			)
		);

		yield put(fetch_notyfication_end(notyfications[0].data.notyfications));
	} catch (err) {
		console.log(err);
	}
}

export function* onSetMarked() {
	yield takeLatest(SET_MARKED, setMarked);
}

export default function* UISagas() {
	yield all([
		call(onSetCommentStart),
		call(onFetchCommentsStart),
		call(onSetMarked)
	]);
}
