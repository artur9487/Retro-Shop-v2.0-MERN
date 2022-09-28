/** @format */

import { db } from '../../fireUtil';
import axios from 'axios';
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
		yield axios
			.post('http://localhost:5000/yourProduct', payload)
			.then(() => console.log('Product Added'));
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

		const response = yield axios.get('http://localhost:5000', {
			params: { pageNumber: payload.page, nPerPage: payload.limit }
		});
		querySnapshot = response.data;

		let newDoc2 = 0;
		querySnapshot.allProducts.forEach((doc) => {
			newDoc2++;
			return;
		});

		const pageInfo = { limit: payload.limit, page: payload.page };
		yield put(set_product_end(querySnapshot.products, newDoc2, pageInfo));
	} catch (err) {
		console.log(err);
	}
}

export function* onfetchProducts() {
	yield takeLatest(FETCH_PROUCTS, fetchProducts);
}

//----------------DELETE YOUR OWN PRODUCT---------
export function* deleteProductStart({ payload }) {
	try {
		yield axios
			.delete('http://localhost:5000/yourProduct', {
				params: { id: payload.id }
			})
			.then(() => console.log('Product deleted'));
		yield put(fetch_my_products_start(payload.email));
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export function* onDeleteProduct() {
	yield takeLatest(DELETE_PRODUCT, deleteProductStart);
}

//-----------UPDATE YOUR OWN PRODUCT--------------
export function* updateProductStart({ payload }) {
	try {
		console.log(payload);
		yield axios
			.put('http://localhost:5000/yourProduct', payload)
			.then(() => console.log('Product updated'));

		//yield setDoc(doc(db, 'Products', payload.id), payload.product);
		yield put(fetch_my_products_start(payload.product.email));
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export function* onUpdateProduct() {
	yield takeLatest(UPDATE_PRODUCT, updateProductStart);
}

//------------ADD THE ORDERS TO NOTYFICATIONS----------
export function* orderNotyfication(payload) {
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

		/*newArr.forEach((item) => {
			const nycRef = doc(db, 'Notyfications', `${Math.random()}`);
			batch.set(nycRef, item);
		});*/
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
		console.log(order);

		yield axios
			.post('http://localhost:5000/order', order)
			.then(() => console.log('Product ordered'));

		let deleteDocuments = [];
		let updateDocuments = [];

		products.forEach((item) => {
			if (item.remain === 0) {
				deleteDocuments.push(item._id);
			} else {
				updateDocuments.push({ productQuantity: item.remain, _id: item._id });
			}
		});

		if (deleteDocuments.length > 0) {
			yield axios
				.delete('http://localhost:5000/order', {
					params: {
						deleteDocuments
					}
				})
				.then(() => console.log('Some products deleted'))
				.catch((err) => console.log(`${err} occured`));
		}

		console.log(updateDocuments);

		if (updateDocuments.length > 0) {
			yield axios
				.put('http://localhost:5000/order', updateDocuments)
				.then(() => console.log('Some products updated'))
				.catch((err) => console.log(`${err} occured`));
		}

		yield put(fetch_orders(email));
		yield put(fetch_my_products_start(email));
		yield put(fetch_purchases(email));
		yield put(fetch_products(limit, page));
		//	yield* orderNotyfication(order);
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}
export function* onAddOrder() {
	yield takeLatest(ADD_ORDER, addOrderStart);
}

//--------------------FETCH AN ORDER-----------------
export function* fetchOrders({ payload }) {
	const response = yield axios.get('http://localhost:5000/personalData', {
		params: { user: payload }
	});

	const orders = response.data;

	console.log(orders);

	yield put(add_order_end(orders));
}

export function* onFetchOrders() {
	yield takeLatest(FETCH_ORDERS, fetchOrders);
}

//--------------FETCH YOUR OWN PRODUCTS----------------
export function* fetchMyProductsStart({ payload }) {
	const response = yield axios.get('http://localhost:5000/yourProduct', {
		params: { email: payload }
	});
	const querySnapshot = response.data;

	yield put(fetch_my_products_end(querySnapshot));
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
	const response = yield axios.get('http://localhost:5000');
	const products = response.data;
	let docNumber = 0;
	products.forEach(() => {
		docNumber++;
		return;
	});
	yield put(get_product_number_end(docNumber));
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
