/** @format */

import {
	ADD_ORDER_END,
	FETCH_MY_PRODUCTS_END,
	FETCH_PROUCTS,
	SET_PRODUCT_START,
	CART_DOWN,
	FETCH_ORDERS,
	FETCH_PURCHASES,
	FETCH_PURCHASES_END,
	GET_PRODUCT_NUMBER,
	GET_PRODUCT_NUMBER_END,
	DELETE_CART_ITEM,
	CLEAR_CART_COUNT,
	CLEAR_CART
} from '../types';
import { SET_PRODUCT_END } from '../types';
import { DELETE_PRODUCT } from '../types';
import { UPDATE_PRODUCT } from '../types';
import { FILTER_PRODUCTS } from '../types';
import { ADD_TO_CART } from '../types';
import { ADD_ORDER } from '../types';
import { FETCH_MY_PRODUCTS_START } from '../types';

//---------------SETTING A NEW PRODUCT TO SAGA----------------
export const set_product_start = (products) => ({
	type: SET_PRODUCT_START,
	payload: products
});

//--------------RETRIEVE THE DATA AFTER FETCHING ABOUT THE PRODUCT----
export const set_product_end = (result, number, pageInfo) => ({
	type: SET_PRODUCT_END,
	payload: { result, number, pageInfo }
});

//---------------DELETE A PRODUCT TO SAGA-------------------------
export const delete_products_start = (id, email) => ({
	type: DELETE_PRODUCT,
	payload: { id, email }
});

//---------------UPDATE A PRODUCT TO SAGA-------------------------------
export const update_product_start = (id, product) => ({
	type: UPDATE_PRODUCT,
	payload: { id, product }
});

//---------------FETCH PRODUCTS FOR A SINGLE PAGE TO SAGA---------------------
export const fetch_products = (limit, page) => ({
	type: FETCH_PROUCTS,
	payload: { limit, page }
});

//-----------------FETCH MY PERSONAL PRODUCTS TO SAGA----------------------------
export const fetch_my_products_start = (user) => ({
	type: FETCH_MY_PRODUCTS_START,
	payload: user
});

//----------------RECEIVE THE PRODUCTS DATA FROM SAGA TO REDUCER--------
export const fetch_my_products_end = (myProducts) => ({
	type: FETCH_MY_PRODUCTS_END,
	payload: myProducts
});

//-----------------FLITER THE SPECIFIC PRODUCT TO REDUCER-----------------------------
export const filter_products = (categoryRange, priceRange, ratingRange) => ({
	type: FILTER_PRODUCTS,
	payload: { categoryRange, priceRange, ratingRange }
});

//-----------------ADD TO CART A PRODUCT TO REDUCER-----------------------------------
export const add_to_cart = (id, quan, type) => ({
	type: ADD_TO_CART,
	payload: { id, quan, type }
});

//-------------ADD AN ORDER TO SAGA------------------------------------------------
export const add_order_start = ([order, pageInfo]) => ({
	type: ADD_ORDER,
	payload: { order, pageInfo }
});

//--------------------RECEIVE THE DATA OF AN ORDER FROM SAGA TO REDUCER--------------------
export const add_order_end = (result) => ({
	type: ADD_ORDER_END,
	payload: result
});

//------------------DECREASE THE QUANTITY OF A PRODUCT IN THE CART TO REDUCER-------------------------
export const cart_down = (id) => ({
	type: CART_DOWN,
	payload: id
});

//--------------------FETCH ALL THE BUYED PRODUCTS TO SAGA-----------------------------------
export const fetch_orders = (email) => ({
	type: FETCH_ORDERS,
	payload: email
});

//--------------------FETCH ALL YOUR PRODUCTS WHICH WERE BUYED TO SAGA-----------------------
export const fetch_purchases = (productUser) => ({
	type: FETCH_PURCHASES,
	payload: productUser
});

//-----------------------RECEIVE THE DATA ABOUT YOUR PRODUCTS WCHICH WERE BUYED FROM SAGA TO REDUCER-------
export const fetch_purchases_end = (result) => ({
	type: FETCH_PURCHASES_END,
	payload: result
});

//---------------------GET THE NUMBER OF PRODUCTS FOR THE PAGINATION TO SAGA------------------------
export const get_product_number = {
	type: GET_PRODUCT_NUMBER
};

//-----------------------RECEIVE THE NUMBER OF PRODUCTS FROM SAGA TO REDUCER-----------------------
export const get_product_number_end = (result) => ({
	type: GET_PRODUCT_NUMBER_END,
	payload: result
});

//------------------------DELETE THE PRODUCT IN THE CART TO REDUCER---------------------------------
export const delete_cart_item = (id) => ({
	type: DELETE_CART_ITEM,
	payload: id
});

//------------------------GET THE COUNT OF THE PRODUCTS IN THE CART TO REDUCER---------------------------
export const cleart_cart_count = {
	type: CLEAR_CART_COUNT
};

//------------------------DELETE COUNT OF THE PRODUCTS IN THE CART TO REDUCER---------------------------
export const clear_cart = {
	type: CLEAR_CART
};
