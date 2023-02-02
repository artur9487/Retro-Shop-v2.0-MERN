/** @format */

import axios from 'axios';
import { takeLatest, put, all, call } from 'redux-saga/effects';
import {
	ADD_ORDER,
	DELETE_PRODUCT,
	FETCH_PROUCTS,
	SET_PRODUCT_START,
	UPDATE_PRODUCT,
	FETCH_MY_PRODUCTS_START,
	FETCH_ORDERS,
	GET_PRODUCT_NUMBER,
	SET_NEW_PRODUCT_IMAGE,
	SET_UPDATED_PRODUCT_IMAGE
} from '../types';
import {
	clear_image,
	fetch_my_products_end,
	fetch_my_products_start,
	fetch_orders,
	fetch_products,
	fetch_purchases_end,
	get_product_number_end,
	set_new_product_image_end,
	set_product_end
} from './actions';
import { fetch_notyfication_end } from '../UI/actions';
import { add_order_end } from './actions';

console.log(process.env.AppUrl);

const mainUrl = 'https://retro-shop-v2-0-mern.onrender.com/';

//--------------UPDATE THE IMAGE IN YOUR PRODUCT---------

export function* setUpdateProductImage({ payload }) {
	try {
		const formData = new FormData();
		formData.append('file', payload.image);
		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}
		const response = yield axios.post(
			`${mainUrl}/api/logged/${payload.email}/yourProduct/updateProduct`,
			formData
		);

		const image = response.data;

		yield put(set_new_product_image_end(image));
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export function* onSetUpdateProductImage() {
	yield takeLatest(SET_UPDATED_PRODUCT_IMAGE, setUpdateProductImage);
}

//--------------SET A NEW IMAGE IN YOUR PRODUCT---------

export function* setNewProductImage({ payload }) {
	try {
		const formData = new FormData();
		formData.append('file', payload.image);
		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}
		const response = yield axios.post(
			`${mainUrl}}/api/logged/${payload.email}/yourProduct/newProduct`,
			formData
		);

		const image = response.data;

		yield put(set_new_product_image_end(image));
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export function* onSetNewProductImage() {
	yield takeLatest(SET_NEW_PRODUCT_IMAGE, setNewProductImage);
}

//----------------ADD YOUR PRODUCT------------------------------

export function* setProductStart({ payload }) {
	try {
		const { email } = payload;

		yield axios
			.post(`${mainUrl}/api/logged/${email}/yourProduct`, payload)
			.then(() => console.log('Product Added'));
		yield put(fetch_my_products_start(payload.email));
		yield put(clear_image);
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
		let response;

		if (payload.user) {
			const { email } = payload.user;

			response = yield axios.get(`${mainUrl}/api/logged/${email}`, {
				params: { pageNumber: payload.page, nPerPage: payload.limit }
			});
			const notyfications = response.data.notyfications;
			yield put(fetch_notyfication_end(notyfications));
		} else {
			response = yield axios.get(`${mainUrl}/api`, {
				params: { pageNumber: payload.page, nPerPage: payload.limit }
			});
		}

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
		const { email } = payload;
		yield axios
			.delete(`${mainUrl}/api/logged/${email}/yourProduct`, {
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
		const { email } = payload.product;
		yield axios
			.put(`${mainUrl}/api/logged/${email}/yourProduct`, payload)
			.then(() => console.log('Product updated'));

		yield put(fetch_my_products_start(email));
		yield put(clear_image);
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export function* onUpdateProduct() {
	yield takeLatest(UPDATE_PRODUCT, updateProductStart);
}

//------------ADD THE ORDERS TO NOTYFICATIONS----------
export function* orderNotyfication(payload) {
	const order = payload;
	const { email, date } = order;

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
							_id: payload.products[i]._id,
							price: payload.products[i].price
						}
					],
					buyer: email,
					date,
					receiver: payload.products[i].userProduct,
					marked: false,
					total: Number(payload.products[i].price),
					type: 'order'
				});
			} else {
				newArr[index] = {
					...newArr[index],
					products: [
						...newArr[index].products,
						{
							count: payload.products[i].count,
							name: payload.products[i].name,
							_id: payload.products[i]._id,
							price: payload.products[i].price
						}
					],
					total: Number(newArr[index].total) + payload.products[i].price
				};
			}
		}

		yield axios
			.post(`${mainUrl}/api/logged/${email}/order`, {
				order: order,
				newArr: newArr
			})
			.then(() => console.log('Order notyfication added'));
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
				.delete(`${mainUrl}/api/logged/${email}/order`, {
					params: {
						deleteDocuments
					}
				})
				.then(() => console.log('Some products deleted'))
				.catch((err) => console.log(`${err} occured`));
		}

		if (updateDocuments.length > 0) {
			yield axios
				.put(`${mainUrl}/api/logged/${email}/order`, updateDocuments)
				.then(() => console.log('Some products updated'))
				.catch((err) => console.log(`${err} occured`));
		}

		yield put(fetch_orders(email));
		yield put(fetch_my_products_start(email));
		yield put(fetch_products(limit, page));
		yield* orderNotyfication(order);
	} catch (e) {
		console.error(e);
	}
}
export function* onAddOrder() {
	yield takeLatest(ADD_ORDER, addOrderStart);
}

//--------------------FETCH AN ORDER-----------------
export function* fetchOrders({ payload }) {
	try {
		const user = payload;
		const response = yield axios.get(
			`${mainUrl}/api/logged/${user}/personalData`
		);

		const querySnapshot = response.data.orders;
		const querySnapshot2 = response.data.notyfications;

		yield put(add_order_end(querySnapshot));
		yield put(fetch_purchases_end(querySnapshot2));
	} catch (e) {
		console.log(e);
	}
}

export function* onFetchOrders() {
	yield takeLatest(FETCH_ORDERS, fetchOrders);
}

//--------------FETCH YOUR OWN PRODUCTS----------------
export function* fetchMyProductsStart({ payload }) {
	try {
		const user = payload;
		const response = yield axios.get(
			`${mainUrl}/api/logged/${user}/yourProduct`
		);
		const querySnapshot = response.data;

		yield put(fetch_my_products_end(querySnapshot));
	} catch (e) {
		console.log(e);
	}
}

export function* onFetchMyProducts() {
	yield takeLatest(FETCH_MY_PRODUCTS_START, fetchMyProductsStart);
}

//---------------GET THE NUMBER OF THE PRODUCTS FOR THE PAGINATION------------
export function* getProductNumber() {
	const response = yield axios.get(`${mainUrl}/api`);
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
		call(onSetNewProductImage),
		call(onSetUpdateProductImage),
		call(onSetProduct),
		call(onDeleteProduct),
		call(onUpdateProduct),
		call(onfetchProducts),
		call(onAddOrder),
		call(onFetchMyProducts),
		call(onFetchOrders),
		call(onGetProductNumber)
	]);
}
