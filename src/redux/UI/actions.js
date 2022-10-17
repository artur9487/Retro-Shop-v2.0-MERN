/** @format */

import {
	CLEAR_SCROLL,
	EXECUTE_SCROLL,
	FETCH_COMMENT_END,
	FETCH_NOTYFICATION_END,
	FETCH_NOTYFICATION_START,
	SET_BAR_HEIGHT,
	SET_MARKED,
	SET_PAGE_COUNT,
	START_SCROLL,
	TOOGLE_CART,
	TOOGLE_NOTYFICATION
} from '../types';
import { SET_COMMENT_START } from '../types';
import { FETCH_COMMENT_START } from '../types';

//------------TOOGLE CART ACTION------
export const toogle_cart = {
	type: TOOGLE_CART
};

//--------------SET A COMMENT TO SAGA--------------
export const set_comment_start = (obj, pageInfo, user) => ({
	type: SET_COMMENT_START,
	payload: { obj, pageInfo, user }
});

//--------------FETCH THE COMMENTS TO SAGA-----------------
export const fetch_comments_start = (productID, user) => ({
	type: FETCH_COMMENT_START,
	payload: { productID, user }
});

//------------RECEIVE THE DATA FROM SAGA TO REDUCER-------
export const fetch_comments_end = (result) => ({
	type: FETCH_COMMENT_END,
	payload: result
});

//--------------FETCH NOTYFICATIONS TO SAGA--------------
export const fetch_notyfication_start = (receiver) => ({
	type: FETCH_NOTYFICATION_START,
	payload: receiver
});

//--------------RECEIVE NOTYFICATION DATA FROM SAGA TO REDUCER---
export const fetch_notyfication_end = (result) => ({
	type: FETCH_NOTYFICATION_END,
	payload: result
});

//-------------SET THAT THE NOTYFICATIONS WERE SEEN TO SAGA---
export const set_marked = (notIdsOrders, notIdsComments, receiver) => ({
	type: SET_MARKED,
	payload: { notIdsOrders, notIdsComments, receiver }
});

//---------------SETTING THE PAGE COUNT-----------
export const set_page_count = (page, limit) => ({
	type: SET_PAGE_COUNT,
	payload: { page, limit }
});

//-----------------SETTING THE POSITION OF THE PRODUCT SECTION-----
export const execute_scroll = (position) => ({
	type: EXECUTE_SCROLL,
	payload: position
});

//-------------SETTING THE BAR HEIGHT FOR THE RIGHT SCROLL TO REDUCER----
export const set_bar_height = (height) => ({
	type: SET_BAR_HEIGHT,
	payload: height
});

//----------------ACTION WHICH EXECUTES THE SCROLL TO REDUCER------
export const start_scroll = {
	type: START_SCROLL
};

//-----------------ACTION WHICH CLEARS THE SCROLL DATA TO REDUCER---
export const clear_scroll = {
	type: CLEAR_SCROLL
};

//--------------------TOGGLE THE NOTYFICATION BAR----------
export const toogle_notyfication = {
	type: TOOGLE_NOTYFICATION
};
