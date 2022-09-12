/** @format */

import { takeLatest, put, all, call } from 'redux-saga/effects';
import {
	SET_COMMENT_START,
	FETCH_COMMENT_START,
	FETCH_NOTYFICATION_START,
	SET_MARKED
} from '../types';
import {
	collection,
	addDoc,
	getDocs,
	doc,
	query,
	where,
	updateDoc,
	getDoc,
	orderBy,
	limit,
	writeBatch
} from 'firebase/firestore';
import { db } from '../../fireUtil';
import {
	fetch_comments_end,
	fetch_comments_start,
	fetch_notyfication_end,
	fetch_notyfication_start
} from './actions';
import { fetch_products } from '../Products/actions';

//-------------SETTING THE COMMENT-------------
export function* setCommentStart({ payload }) {
	const { productID, value } = payload.obj;
	const { limit, page } = payload.pageInfo;
	try {
		yield addDoc(collection(db, 'Notyfications'), payload.obj);
		console.log('comment added');

		const certainProduct = doc(db, 'Products', productID);
		const docSnap = yield getDoc(certainProduct);
		if (docSnap.exists()) {
			const count = docSnap.data().ratingCount;
			const value2 = docSnap.data().ratingValue;
			yield updateDoc(certainProduct, {
				ratingValue: (value2 * count + value) / (count + 1),
				ratingCount: count + 1
			});
			yield put(fetch_comments_start(productID));
			yield put(fetch_products(limit, page));
		} else {
			console.log('no such document exist');
		}
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
		const q = query(
			collection(db, 'Notyfications'),
			where('type', '==', 'comment'),
			where('productID', '==', payload),
			orderBy('date', 'desc')
		);
		const querySnapshot = yield getDocs(q);
		let newDoc = [];
		querySnapshot.forEach((doc) => {
			newDoc.push({ ...doc.data(), id: doc.id });
		});
		yield put(fetch_comments_end(newDoc));
	} catch (err) {
		console.log(err);
	}
}
export function* onFetchCommentsStart() {
	yield takeLatest(FETCH_COMMENT_START, fetchCommentsStart);
}

//--------------FETCHING NOTYFICATIONS-------------------
export function* fetchNotyficationStart({ payload }) {
	try {
		const q = query(
			collection(db, 'Notyfications'),
			where('receiver', '==', payload),
			orderBy('date', 'desc'),
			limit(10)
		);
		const querySnapshot = yield getDocs(q);
		let newDoc = [];
		querySnapshot.forEach((doc) => {
			newDoc.push({ ...doc.data(), id: doc.id });
		});
		yield put(fetch_notyfication_end(newDoc));
	} catch (err) {
		console.log(err);
	}
}

export function* onFetchNotyficationStart() {
	yield takeLatest(FETCH_NOTYFICATION_START, fetchNotyficationStart);
}

//-----------------SETTING THE RIGHT DATA OF THE NOTYFICATION DATA WHICH WERE READ--
export function* setMarked({ payload }) {
	const batch = writeBatch(db);
	try {
		payload.ids.forEach((item) => {
			const docRef = doc(db, 'Notyfications', item);
			batch.update(docRef, { marked: true });
		});
		yield batch.commit();
		yield put(fetch_notyfication_start(payload.receiver));
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
		call(onFetchNotyficationStart),
		call(onSetMarked)
	]);
}
