/** @format */

import React, { useContext, useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toogle_cart } from '../../redux/UI/actions';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { Typography, Stack, Button } from '@mui/material';
import CartItem from './CartItem';
import {
	add_order_start,
	cleart_cart_count,
	clear_cart
} from '../../redux/Products/actions';
import { MainContext } from '../../Context';
import useCustomFadeHook from '../../customHooks/customFadeHook';

const CartLayout = () => {
	const { user } = useContext(MainContext);
	const state = useSelector((item) => item.UIData.openCart);
	const state2 = useSelector((item) => item.productsData.cart);
	const pageInfo = useSelector((item) => item.productsData.pageInfo);
	const [notif, setNotif] = useState('');
	const dispatch = useDispatch();
	const fontOleo = 'Oleo Script Swash Caps';
	const { fadeIn, setFade } = useCustomFadeHook();

	useEffect(() => {
		setFade();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notif]);

	useEffect(() => {
		if (state2.length > 0) {
			setNotif('');
		}
	}, [state2]);

	if (user) {
		const { email } = user;
		const total = state2.reduce((one, two) => {
			return (one + Number(two.productPrice)).toFixed(2);
		}, 0);

		const handleCart = () => {
			dispatch(toogle_cart);
			dispatch(cleart_cart_count);
		};
		//---------------MAKE THE ORDER-----------------------------
		const orderHandle = () => {
			if (state2.length === 0) {
				setNotif('err');
				return;
			}
			let proCategories = [];

			for (let i = 0; i < state2.length; i++) {
				let catIndx;
				catIndx = proCategories.findIndex(
					(item) => item === state2[i].category
				);
				if (catIndx < 0) {
					proCategories.push(state2[i].category);
				}
			}

			const obj = {
				date: new Date(),
				total: total,
				categories: [...proCategories],
				products: state2.map((item) => {
					const name = item.productName;
					const price = item.productPrice;
					const count = item.count;
					const id = item.id;
					const remain = item.remain;
					const userProduct = item.email;
					return { name, price, count, id, remain, userProduct };
				})
			};

			dispatch(add_order_start([{ ...obj, email }, pageInfo]));
			dispatch(clear_cart);
			setTimeout(() => {
				setNotif('succ');
			}, 500);
			setTimeout(() => {
				setNotif('');
			}, 3500);
		};
		//---------------------------------------------------------------
		return (
			<>
				<Drawer
					PaperProps={{
						sx: { minWidth: 250 }
					}}
					anchor='right'
					open={state}
					onClose={() => handleCart()}>
					<Box sx={{ padding: 3 }}>
						<Typography
							textAlign='center'
							sx={{ fontFamily: fontOleo, fontStyle: 'italic' }}
							variant='h4'
							gutterBottom
							component='div'>
							Your Cart
						</Typography>
						<Box
							sx={{
								width: '100%',
								bgcolor: 'background.paper'
							}}>
							<Stack
								direction='column'
								justifyContent='space-around'
								alignItems='space-around'
								spacing={3}>
								{notif === 'err' && (
									<Typography
										variant='h6'
										sx={{ color: 'red', fontFamily: fontOleo, mt: 3 }}>
										No products in cart!
									</Typography>
								)}
								{notif === 'succ' && state2.length === 0 && (
									<Typography
										variant='h6'
										sx={{ color: 'green', fontFamily: fontOleo, mt: 3 }}>
										Ordered sucessfully!
									</Typography>
								)}

								<List>
									{state2.map((item, indx) => {
										return <CartItem key={indx} indx={indx} {...item} />;
									})}
								</List>
								<Typography
									sx={{ fontFamily: 'Sofia', fontStyle: 'italic' }}
									variant='h6'
									gutterBottom
									component='span'>
									Your Total: {total}$
								</Typography>
								<Button
									color='inherit'
									sx={{
										color: 'black',
										fontFamily: fontOleo,
										textTransform: 'none',
										fontSize: 20
									}}
									onClick={orderHandle}>
									Make Order
								</Button>
							</Stack>
						</Box>
					</Box>
				</Drawer>
			</>
		);
	} else return null;
};
export default CartLayout;
