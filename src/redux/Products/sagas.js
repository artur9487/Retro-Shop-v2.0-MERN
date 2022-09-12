/** @format */

import { db } from '../../fireUtil';
import {
	collection,
	addDoc,
	getDocs,
	deleteDoc,
	doc,
	setDoc,
	query,
	where,
	writeBatch,
	orderBy,
	limit,
	startAfter
} from 'firebase/firestore';
import { takeLatest, put, all, call } from 'redux-saga/effects';
import {
	ADD_ORDER,
	DELETE_PRODUCT,
	FETCH_PROUCTS,
	SET_PRODUCT_START,
	UPDATE_PRODUCT,
	FETCH_MY_PRODUCTS_START,
	FETCH_ORDERS,
	FETCH_PURCHASES,
	GET_PRODUCT_NUMBER
} from '../types';
import {
	fetch_my_products_end,
	fetch_my_products_start,
	fetch_orders,
	fetch_products,
	fetch_purchases,
	fetch_purchases_end,
	get_product_number_end,
	set_product_end
} from './actions';
import { add_order_end } from './actions';

//----------------ADD YOUR PRODUCT------------------------------
export function* setProductStart({ payload }) {
	try {
		yield addDoc(collection(db, 'Products'), payload);
		console.log('Product Added');
		yield put(fetch_my_products_start(payload.email));
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export function* onSetProduct() {
	yield takeLatest(SET_PRODUCT_START, setProductStart);
}

//---------------------------FETCHING THE PRODUCTS----------------------------
export function* fetchProducts({ payload }) {
	try {
		let querySnapshot;
		let first;
		if (payload.page === 1) {
			first = query(
				collection(db, 'Products'),
				orderBy('date', 'desc'),
				limit(payload.limit)
			);
			querySnapshot = yield getDocs(first);
		} else {
			first = query(
				collection(db, 'Products'),
				orderBy('date', 'desc'),
				limit(payload.limit)
			);
			const documentSnapshots = yield getDocs(first);
			const lastVisible =
				documentSnapshots.docs[documentSnapshots.docs.length - 1];
			const q = query(
				collection(db, 'Products'),
				orderBy('date', 'desc'),
				startAfter(lastVisible),
				limit(6)
			);
			querySnapshot = yield getDocs(q);
		}
		const querySnapshot2 = yield getDocs(collection(db, 'Products'));

		let newDoc = [];
		querySnapshot.forEach((doc) => {
			newDoc.push({ ...doc.data(), id: doc.id });
		});

		let newDoc2 = 0;
		querySnapshot2.forEach((doc) => {
			newDoc2++;
			return;
		});
		const pageInfo = { limit: payload.limit, page: payload.page };
		yield put(set_product_end(newDoc, newDoc2, pageInfo));
	} catch (err) {
		console.log(err);
	}
}

export function* onfetchProducts() {
	yield takeLatest(FETCH_PROUCTS, fetchProducts);
}

//----------------DELETE YOUR OWN PRODUCT---------
export function* deleteProductStart({ payload }) {
	yield deleteDoc(doc(db, 'Products', payload.id));
	yield put(fetch_my_products_start(payload.email));
}

export function* onDeleteProduct() {
	yield takeLatest(DELETE_PRODUCT, deleteProductStart);
}

//-----------UPDATE YOUR OWN PRODUCT--------------
export function* updateProductStart({ payload }) {
	yield setDoc(doc(db, 'Products', payload.id), payload.product);
	yield put(fetch_my_products_start(payload.product.email));
}

export function* onUpdateProduct() {
	yield takeLatest(UPDATE_PRODUCT, updateProductStart);
}

//------------ADD THE ORDERS TO NOTYFICATIONS----------
export function* orderNotyfication(payload) {
	const batch = writeBatch(db);
	const { email, date } = payload;
	try {
		let newArr = [];
		for (let i = 0; i < payload.products.length; i++) {
			const index = newArr.findIndex((item) => {
				return item.receiver === payload.products[i].userProduct;
			});
			if (index < 0) {
				newArr.push({
					products: [
						{
							count: payload.products[i].count,
							name: payload.products[i].name,
							id: payload.products[i].id,
							price: payload.products[i].price
						}
					],
					buyer: email,
					date,
					receiver: payload.products[i].userProduct,
					type: 'order',
					marked: false,
					total: payload.products[i].price
				});
			} else {
				newArr[index] = {
					...newArr[index],
					products: [
						...newArr[index].products,
						{
							count: payload.products[i].count,
							name: payload.products[i].name,
							id: payload.products[i].id,
							price: payload.products[i].price
						}
					],
					total: newArr[index].total + payload.products[i].price
				};
			}
		}

		newArr.forEach((item) => {
			const nycRef = doc(db, 'Notyfications', `${Math.random()}`);
			batch.set(nycRef, item);
		});
		yield batch.commit();
	} catch (err) {
		console.log(err);
	}
}

//----------------ADD AN ORDER---------------------------------
export function* addOrderStart({ payload }) {
	try {
		const { order } = payload;

		const {
			order: { products, email },
			pageInfo: { limit, page }
		} = payload;

		const batch = writeBatch(db);
		yield addDoc(collection(db, 'Orders'), order);
		console.log('Order Added');

		products.forEach((item) => {
			const docRef = doc(db, 'Products', item.id);
			if (item.remain === 0) {
				batch.delete(docRef);
			} else {
				batch.update(docRef, { productQuantity: item.remain });
			}
		});

		yield batch.commit();

		yield put(fetch_orders(email));
		yield put(fetch_my_products_start(email));
		yield put(fetch_purchases(email));
		yield put(fetch_products(limit, page));
		yield* orderNotyfication(order);
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}
export function* onAddOrder() {
	yield takeLatest(ADD_ORDER, addOrderStart);
}

//--------------------FETCH AN ORDER-----------------
export function* fetchOrders({ payload }) {
	const q = query(
		collection(db, 'Orders'),
		where('email', '==', payload),
		limit(10),
		orderBy('date', 'desc')
	);
	const querySnapshot = yield getDocs(q);
	let newDoc = [];
	querySnapshot.forEach((doc) => {
		newDoc.push({ ...doc.data(), id: doc.id });
	});
	yield put(add_order_end(newDoc));
}

export function* onFetchOrders() {
	yield takeLatest(FETCH_ORDERS, fetchOrders);
}

//--------------FETCH YOUR OWN PRODUCTS----------------
export function* fetchMyProductsStart({ payload }) {
	const q = query(
		collection(db, 'Products'),
		where('email', '==', payload),
		orderBy('date', 'desc')
	);
	const querySnapshot = yield getDocs(q);
	let newDoc = [];
	querySnapshot.forEach((doc) => {
		newDoc.push({ ...doc.data(), id: doc.id });
	});
	yield put(fetch_my_products_end(newDoc));
}

export function* onFetchMyProducts() {
	yield takeLatest(FETCH_MY_PRODUCTS_START, fetchMyProductsStart);
}

//---------------FETCH THE PRODUCTS WHICH WERE BUYED BY OTHERS------------
export function* fetchPurhases({ payload }) {
	const q = query(
		collection(db, 'Notyfications'),
		where('receiver', '==', payload),
		where('type', '==', 'order'),
		limit(10),
		orderBy('date', 'desc')
	);
	const querySnapshot = yield getDocs(q);
	let newDoc = [];
	querySnapshot.forEach((doc) => {
		newDoc.push({ ...doc.data(), id: doc.id });
	});
	yield put(fetch_purchases_end(newDoc));
}

export function* onFetchPurchases() {
	yield takeLatest(FETCH_PURCHASES, fetchPurhases);
}

//---------------GET THE NUMBER OF THE PRODUCTS FOR THE PAGINATION------------
export function* getProductNumber() {
	const querySnapshot = yield getDocs(collection(db, 'Products'));
	let newDoc = 0;
	querySnapshot.forEach((doc) => {
		newDoc++;
		return;
	});
	yield put(get_product_number_end(newDoc));
}

export function* onGetProductNumber() {
	yield takeLatest(GET_PRODUCT_NUMBER, getProductNumber);
}

export default function* productSagas() {
	yield all([
		call(onSetProduct),
		call(onDeleteProduct),
		call(onUpdateProduct),
		call(onfetchProducts),
		call(onAddOrder),
		call(onFetchMyProducts),
		call(onFetchOrders),
		call(onFetchPurchases),
		call(onGetProductNumber)
	]);
}
