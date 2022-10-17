/** @format */

import {
	CLEAR_SCROLL,
	EXECUTE_SCROLL,
	FETCH_COMMENT_END,
	FETCH_NOTYFICATION_END,
	SET_BAR_HEIGHT,
	START_SCROLL,
	TOOGLE_CART,
	TOOGLE_NOTYFICATION
} from '../types';

const INITIAL_STATE = {
	openCart: false,
	comments: [],
	notyfications: [],
	startScroll: false,
	scrollPos: 0,
	barHeight: 0,
	toogleNotyfication: false
};

const UIReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		//------------TOOGLE CART ACTION------
		case TOOGLE_CART:
			let bol = state.openCart === false ? true : false;
			return {
				...state,
				openCart: bol
			};

		//--------------FETCH COMMENTS-----------------
		case FETCH_COMMENT_END:
			return {
				...state,
				comments: [...action.payload]
			};
		//-----------FETCH NOTYFICATIONS-----------------
		case FETCH_NOTYFICATION_END:
			return {
				...state,
				notyfications: [...action.payload]
			};
		//----------SETTING THE POSITION OF PRODUCT SECTION-----------------
		case EXECUTE_SCROLL:
			return {
				...state,
				scrollPos: { height: action.payload, bol: true }
			};
		//------------SET THE BAR HEIGHT-------
		case SET_BAR_HEIGHT:
			return {
				...state,
				barHeight: { height: action.payload, bol: true }
			};
		//-----------START SCOLLINGING----------
		case START_SCROLL:
			return {
				...state,
				startScroll: true
			};
		//-----------CLEAR THE SCROLL DATA----------
		case CLEAR_SCROLL:
			return {
				...state,
				startScroll: false
			};
		//----------TOOGLE THE NOTYFICATION BAR STATUS----
		case TOOGLE_NOTYFICATION:
			let notyficationStatus =
				state.toogleNotyfication === false ? true : false;
			return {
				...state,
				toogleNotyfication: notyficationStatus
			};
		default:
			return state;
	}
};

export default UIReducer;
