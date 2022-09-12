/** @format */

import React, { useState, useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
	delete_products_start,
	set_product_start,
	update_product_start
} from '../redux/Products/actions';
import DialogComp from './Dialog';
import { Context } from '../Context';
import { fetch_my_products_start } from '../redux/Products/actions';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Grid } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import moment from 'moment';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useCustomFadeHook from '../customHooks/customFadeHook';
import Footer from '../Footer';
import '../globalVariables.scss';
import SideBar from './SideBar';
import { MainContext } from '../Context';

const initErr = {
	imageErr: false,
	productNameErr: false,
	productPriceErr: false,
	productQuantityErr: false,
	categoryErr: false
};

const MyProducts = () => {
	const {
		maxWidth1200,
		user: { email }
	} = useContext(MainContext);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const prod = useSelector((state) => state.productsData.myProducts);
	const [open, setOpen] = useState(false);
	const [productName, setProductName] = useState('');
	const [productPrice, setProductPrice] = useState('');
	const [category, setCategory] = useState('');
	const [productQuantity, setProductQuantity] = useState('');
	const [ratingValue, setRatingValue] = useState(0);
	const [ratingCount, setRatingCount] = useState(0);
	const [image, setImage] = useState('');
	const [type, setType] = useState('');
	const [currentId, setCurrentId] = useState('');
	const [errors, setErrors] = useState(initErr);
	const { fadeIn, setFade } = useCustomFadeHook();
	const [matchState, setMatchState] = useState(false);

	//---------------FADING FUNC--------------------
	useEffect(() => {
		setFade();
		setMatchState(!maxWidth1200);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maxWidth1200]);

	//---------FETCHING THE PRODUCTS--------------
	useEffect(() => {
		dispatch(fetch_my_products_start(email));
	}, [dispatch, email]);

	//---------------INITIAL DATA--------------------
	const dataToStart = () => {
		setImage('');
		setProductName('');
		setProductPrice('');
		setCategory('');
		setProductQuantity('');
		setErrors(initErr);
	};

	//------------DIALOG OPEN AND CLOSE--------------
	const handleClickOpen = (typ) => {
		setType(typ);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		dataToStart();
	};

	//------------UPLOAD THE IMAGE FILE ON THE SERVER--------------
	const onFileChange = async (e) => {
		const file = e.target.files[0];
		const storage = getStorage();
		const storageRef = ref(storage, `productImages/${file.name}`);
		await uploadBytes(storageRef, file).then((snapshot) => {
			console.log('Uploaded a blob or file!');
		});
		await getDownloadURL(storageRef).then((url) => {
			setImage(url);
		});
	};

	//------------ERROR VALIDATION HANDLING-------------
	const handleErrors = () => {
		let errorsy = { ...initErr };
		let errorNum = 0;

		if (!image) {
			errorsy = { ...errorsy, imageErr: true };
			errorNum++;
		}
		if (!productName) {
			errorsy = { ...errorsy, productNameErr: true };
			errorNum++;
		}
		if (!productPrice || productPrice <= 0) {
			errorsy = { ...errorsy, productPriceErr: true };
			errorNum++;
		}
		if (!category) {
			errorsy = { ...errorsy, categoryErr: true };
			errorNum++;
		}
		if (!productQuantity || productQuantity <= 0) {
			errorsy = { ...errorsy, productQuantityErr: true };
			errorNum++;
		}
		if (errorNum > 0) {
			setErrors(errorsy);
		}
		return errorNum;
	};

	//------------ADDING NEW PRODUCT-------------
	const handleSubmit = () => {
		if (handleErrors() > 0) {
			return;
		}

		dispatch(
			set_product_start({
				image,
				productName,
				productPrice,
				category,
				email,
				ratingValue: ratingValue,
				ratingCount: ratingCount,
				productQuantity,
				date: new Date()
			})
		);

		handleClose();
	};

	//------------DELETING A PRODUCT-------------
	const handleDelete = (id, email) => {
		dispatch(delete_products_start(id, email));
	};

	//------------INITIAL DATA FOR THE UPDATE DIALOG-------------
	const handleUpdate = (id, typ) => {
		const prod2 = prod.filter((item) => item.id === id);
		const {
			image,
			productName,
			productPrice,
			category,
			productQuantity,
			ratingCount,
			ratingValue
		} = prod2[0];
		setImage(image);
		setProductName(productName);
		setProductPrice(productPrice);
		setCategory(category);
		setProductQuantity(productQuantity);
		setRatingCount(ratingCount);
		setRatingValue(ratingValue);
		setCurrentId(id);
		setType(typ);
		setOpen(true);
	};

	//--------------SUBMITING THE UPDATE--------------------
	const handleSubmitUpdate = () => {
		if (handleErrors() > 0) {
			return;
		}

		const produc = {
			image,
			productName,
			productPrice,
			category,
			email,
			ratingValue: ratingValue,
			ratingCount: ratingCount,
			productQuantity,
			date: new Date()
		};
		dispatch(update_product_start(currentId, produc));
		handleClose();
	};

	const menu = [
		'Lp',
		'Adding Date',
		'Product name',
		'Price',
		'Category',
		'Quantity'
	];
	//--------------ADDING THE RIGHT CURRENCY IN THE PRICE FORM--------------------
	const handlePrice = (e) => {
		const s = e.toString();
		if (e === 0) {
			return;
		}
		const value =
			s.indexOf('.') >= 0
				? s.substr(0, s.indexOf('.')) + s.substr(s.indexOf('.'), 3)
				: s;
		setProductPrice(Number(value));
	};

	//--------------ADDING THE RIGHT QUANTITY IN THE QUANTITY FORM--------------------
	const handleQuan = (e) => {
		if (e === 0) {
			return;
		} else {
			setProductQuantity(e);
		}
	};
	//---------------------------------------------------------------------------
	const menuArr = menu.map((item, indx) => {
		const tableCell = (
			<TableCell
				key={indx}
				sx={{
					fontFamily: 'Sofia',
					fontWeight: 1000,
					fontSize: 20,
					fontStyle: 'italic'
				}}
				variant='head'
				size='medium'
				align='center'>
				{item}
			</TableCell>
		);
		if (!matchState) {
			if (indx > 2) {
				return;
			} else {
				return tableCell;
			}
		} else {
			return tableCell;
		}
	});

	return (
		<Context.Provider
			value={{
				handleQuan,
				handlePrice,
				open,
				setOpen,
				productName,
				productPrice,
				category,
				handleSubmit,
				handleClose,
				setProductName,
				setCategory,
				onFileChange,
				type,
				handleSubmitUpdate,
				productQuantity,
				errors,
				image,
				handleClickOpen
			}}>
			<Outlet />
			{prod ? (
				<>
					<Grid
						sx={{ minHeight: '100vh' }}
						spacing={2}
						alignItems='flex-start'
						justifyContent='flex-start'
						container
						direction={'column'}
						className={`${fadeIn} container`}>
						<Grid
							item
							xs={2}
							container
							justifyContent='center'
							alignItems='center'>
							<SideBar />
						</Grid>
						<Grid sx={{ width: '100%' }} item xs={10}>
							<TableContainer component={Paper}>
								<Table sx={{ width: '100%' }} aria-label='simple table'>
									<TableHead>
										<TableRow>
											{menuArr}
											<TableCell
												sx={{
													fontFamily: 'Sofia',
													fontWeight: 1000,
													fontSize: 20,
													fontStyle: 'italic'
												}}
												variant='head'
												size='medium'
												align='center'>
												Options
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{prod.map((row, indx) => (
											<TableRow
												key={indx}
												sx={{
													'&:last-child td, &:last-child th': { border: 0 }
												}}>
												<TableCell
													sx={{ fontFamily: 'Sofia', fontSize: 13 }}
													align='center'>
													{indx + 1}.
												</TableCell>
												<TableCell
													sx={{ fontFamily: 'Sofia', fontSize: 13 }}
													align='center'>
													{moment(row.date.seconds * 1000).format(
														'MMM Do YY, h:mm'
													)}
												</TableCell>
												<TableCell
													sx={{ fontFamily: 'Sofia', fontSize: 17 }}
													align='center'>
													{row.productName}
												</TableCell>
												{matchState && (
													<>
														<TableCell
															sx={{ fontFamily: 'Sofia', fontSize: 13 }}
															align='center'>
															{row.productPrice}$
														</TableCell>
														<TableCell
															sx={{ fontFamily: 'Sofia', fontSize: 17 }}
															align='center'>
															{row.category}
														</TableCell>
														<TableCell
															sx={{ fontFamily: 'Sofia', fontSize: 13 }}
															align='center'>
															{row.productQuantity}
														</TableCell>
													</>
												)}
												<TableCell align='center'>
													<Tooltip title='See Details'>
														<IconButton
															onClick={() =>
																navigate(`/yourProduct/${row.id}`)
															}>
															<DirectionsIcon />
														</IconButton>
													</Tooltip>
													<Tooltip title='Update'>
														<IconButton
															onClick={() => handleUpdate(row.id, 'update')}>
															<BorderColorIcon />
														</IconButton>
													</Tooltip>
													<Tooltip title='Remove'>
														<IconButton
															onClick={() => handleDelete(row.id, row.email)}>
															<RemoveCircleIcon />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
							{prod.length === 0 && (
								<Typography
									textAlign='center'
									variant='h5'
									sx={{ fontFamily: 'Oleo Script Swash Caps', mt: 3 }}>
									You dont have any products
								</Typography>
							)}
							<div>
								<DialogComp />
							</div>
						</Grid>
					</Grid>
					<Footer />
				</>
			) : null}
		</Context.Provider>
	);
};

export default MyProducts;
