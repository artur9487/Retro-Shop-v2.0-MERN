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
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(0);
	const { fadeIn, setFade } = useCustomFadeHook();
	const [error, setError] = useState(false);

	const location = useLocation();
	const { pathname } = location;

	const product = proProduct.filter((item) => {
		return item.id === productID;
	});

	//---------------------FADE IN LOGIC----------------------
	useEffect(() => {
		setFade();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//---------------------FETCHING THE COMMENTS----------------------
	useEffect(() => {
		setOpen(true);
		dispatch(fetch_comments_start(productID));
		return () => {
			setOpen(false);
		};
	}, [params, dispatch, productID]);

	//---------------------CLOSING DIALOG-----------------------
	const handleClose = () => {
		setOpen(false);
		navigate(-1);
		setError(false);
	};

	//---------------------ADDING TO CART------------------------
	const handleAdd = () => {
		dispatch(add_to_cart(productID, count, 'dashboard'));
		handleClose();
	};
	//---------------------------------------------

	return (
		<>
			<Context.Provider
				value={{
					maxWidth600,
					pathname,
					product,
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
