/** @format */

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Typography } from '@mui/material';
import { Context } from '../Context';
import ProductSection from './ProductSection';
import CommentSection from './CommentSection';
import { useDispatch } from 'react-redux';
import { fetch_comments_start } from '../redux/UI/actions';
import { add_to_cart } from '../redux/Products/actions';
import { useNavigate } from 'react-router-dom';
import useCustomFadeHook from '../customHooks/customFadeHook';
import { MainContext } from '../Context';
import { useLocation } from 'react-router-dom';

const ProductDetails = () => {
	const { user, maxWidth600 } = useContext(MainContext);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();
	const { productID } = params;
	const proProduct = useSelector((state) => state.productsData.products);
	const myProducts = useSelector((state) => state.productsData.myProducts);
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(0);
	const { fadeIn, setFade } = useCustomFadeHook();
	const [error, setError] = useState(false);
	const [orderCountError, setOrderCountError] = useState(false);

	const location = useLocation();
	const { pathname } = location;

	let productDataArr;

	if (pathname !== `/api/logged/${user?.email}/yourProduct/${productID}`) {
		productDataArr = proProduct;
	} else {
		productDataArr = myProducts;
	}

	const productData = productDataArr.filter((item) => {
		return item._id === productID;
	});

	//---------------------FADE IN LOGIC----------------------
	useEffect(() => {
		setFade();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//---------------------FETCHING THE COMMENTS----------------------
	useEffect(() => {
		setOpen(true);
		dispatch(fetch_comments_start(productID, user));
		return () => {
			setOpen(false);
		};
	}, [params, dispatch, productID, user]);

	//---------------------CLOSING DIALOG-----------------------
	const handleClose = () => {
		setOpen(false);
		if (pathname === `/api/logged/${user?.email}/${productID}`) {
			navigate(`/api/logged/${user.email}`);
		} else {
			navigate(-1);
		}

		setError(false);
		setOrderCountError(false);
	};

	//---------------------ADDING TO CART------------------------
	const handleAdd = () => {
		if (count <= 0 || count > productData[0].productQuantity) {
			setOrderCountError(true);
		} else {
			dispatch(add_to_cart(productID, count, 'dashboard'));
			handleClose();
		}
	};

	return (
		<>
			<Context.Provider
				value={{
					orderCountError,
					maxWidth600,
					pathname,
					productData,
					productID,
					handleAdd,
					count,
					setCount,
					user,
					fadeIn,
					error,
					setError
				}}>
				<Dialog
					fullWidth
					maxWidth='md'
					open={open}
					keepMounted
					onClose={handleClose}
					aria-describedby='alert-dialog-slide-description'>
					<DialogTitle>
						<Typography
							sx={{
								fontFamily: 'Oleo Script Swash Caps',
								p: 2,
								fontStyle: 'italic',
								fontSize: 35
							}}
							textAlign='center'>
							Product Detail
						</Typography>
					</DialogTitle>
					<DialogContent>
						<Stack direction={!maxWidth600 ? 'row' : 'column'} spacing={5}>
							<ProductSection />
							<CommentSection />
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							color='inherit'
							sx={{
								fontFamily: 'Oleo Script Swash Caps',
								color: 'black',
								textTransform: 'none',
								width: 200,
								fontSize: 30
							}}
							onClick={handleClose}>
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</Context.Provider>
		</>
	);
};

export default ProductDetails;
