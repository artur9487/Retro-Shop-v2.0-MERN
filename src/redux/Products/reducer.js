/** @format */

import {
	FILTER_PRODUCTS,
	SET_PRODUCT_END,
	ADD_TO_CART,
	ADD_ORDER_END,
	FETCH_MY_PRODUCTS_END,
	CART_DOWN,
	FETCH_PURCHASES_END,
	GET_PRODUCT_NUMBER_END,
	DELETE_CART_ITEM,
	CLEAR_CART_COUNT,
	CLEAR_CART
} from '../types';

const INITIAL_STATE = {
	products: [],
	product: {},
	cart: [],
	orders: [],
	myProducts: [],
	myPurchases: [],
	productNumber: 0,
	cartCount: 0,
	pageInfo: {}
};

export const productsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		//--------------RETRIEVE THE DATA AFTER FETCHING ABOUT THE PRODUCT----
		case SET_PRODUCT_END:
			return {
				...state,
				products: action.payload.result,
				productNumber: Math.ceil(action.payload.number / 6),
				pageInfo: action.payload.pageInfo
			};

		//-----------------FLITER THE SPECIFIC PRODUCT -----------------------------
		case FILTER_PRODUCTS:
			const { priceRange, categoryRange, ratingRange } = action.payload;
			const filtered = state.products.filter((item) => {
				return (
					item.category === categoryRange &&
					Number(priceRange[0]) < item.productPrice &&
					Number(priceRange[1]) > item.productPrice &&
					Number(ratingRange) <= item.ratingValue
				);
			});
			return {
				...state,
				products: [...filtered]
			};

		//-----------------ADD TO CART A PRODUCT-----------------------------------
		case ADD_TO_CART:
			const proCart = [...state.cart];
			const proProducts = [...state.products];
			const { id, quan, type } = action.payload;
			let count2 = Number(quan);
			const indx = proCart.findIndex((item) => item.id === id);
			const indx2 = proProducts.findIndex((item) => item.id === id);
			let proCartCount = 0;

			if (type === 'dashboard' && indx >= 0) {
				proCartCount = state.cartCount + count2 - proCart[indx].count;
				proCart[indx].count = count2;
				proCart[indx].productPrice = (
					proProducts[indx2].productPrice * count2
				).toFixed(2);
				proCart[indx].remain = proProducts[indx2].productQuantity - count2;
			} else if (type === 'dashboard') {
				proCart.push({
					...proProducts[indx2],
					productPrice: (proProducts[indx2].productPrice * count2).toFixed(2),
					count: count2,
					remain: proProducts[indx2].productQuantity - count2
				});
				proCartCount = state.cartCount + count2;
			} else {
				if (proCart[indx].count > proProducts[indx2].productQuantity - 1) {
					console.log('no much products');
				} else {
					proCart[indx].count = proCart[indx].count + 1;
					proCart[indx].productPrice = (
						proProducts[indx2].productPrice * proCart[indx].count
					).toFixed(2);
					proCart[indx].remain =
						proProducts[indx2].productQuantity - proCart[indx].count;
					count2 = proCart[indx].count + 1;
				}
			}
			return {
				...state,
				cart: [...proCart],
				cartCount: proCartCount
			};

		//-------------ADD AN ORDER----------------------------------
		case ADD_ORDER_END:
			return {
				...state,
				orders: [...action.payload]
			};

		//-------------FETCH THE PRODUCTS---------------------------------
		case FETCH_MY_PRODUCTS_END:
			return {
				...state,
				myProducts: action.payload
			};

		//------------------DECREASE THE QUANTITY OF A PRODUCT IN THE CART------------------------
		case CART_DOWN:
			let proCartt = [...state.cart];
			let proProductss = [...state.products];
			const indxx = proCartt.findIndex((item) => item.id === action.payload);
			const indxx2 = proProductss.findIndex(
				(item) => item.id === action.payload
			);

			if (proCartt[indxx].count <= 1) {
				proCartt = proCartt.filter((item) => {
					return item.id !== action.payload;
				});
			} else {
				proCartt[indxx].count = proCartt[indxx].count - 1;
				proCartt[indxx].productPrice = (
					proProductss[indxx2].productPrice * proCartt[indxx].count
				).toFixed(2);
				proCartt[indxx].remain =
					proProductss[indxx2].productQuantity - proCartt[indxx].count;
			}

			return {
				...state,
				cart: [...proCartt]
			};

		//------------------FETCH YOUR BUYED PRODUCTS---------
		case FETCH_PURCHASES_END:
			return {
				...state,
				myPurchases: [...action.payload]
			};
		//---------------------GET THE NUMBER OF PRODUCTS FOR THE PAGINATION ------------------------
		case GET_PRODUCT_NUMBER_END:
			return { ...state, productNumber: action.payload };

		//-------------------DELETE THE CART ITEM-------------------------------------
		case DELETE_CART_ITEM:
			let proCarttt = [...state.cart];
			proCarttt = proCarttt.filter((item) => {
				return item.id !== action.payload;
			});
			return { ...state, cart: [...proCarttt] };
		//-----------------------------CLEAR THE COUNT OF THE PRODUCTS IN THE CART------------------------
		case CLEAR_CART_COUNT:
			return { ...state, cartCount: 0 };
		//-----------------------------DELETE ALL THE ITEMS IN THE CART------------------------
		case CLEAR_CART:
			return { ...state, cart: [] };
		default:
			return state;
	}
};
