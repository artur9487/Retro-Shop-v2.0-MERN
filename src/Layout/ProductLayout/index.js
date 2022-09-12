/** @format */

import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import Grid from '@mui/material/Grid';
import { fetch_products } from '../../redux/Products/actions';
import { useDispatch } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import { Stack, Typography } from '@mui/material';
import '../../globalVariables.scss';
import useCustomFadeHook from '../../customHooks/customFadeHook';
import { MainContext } from '../../Context';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProductLayout = () => {
	const { maxWidth1200, maxWidth900, maxWidth600 } = useContext(MainContext);
	const dispatch = useDispatch();
	const products = useSelector((state) => state.productsData);
	const { fadeIn, setFade } = useCustomFadeHook();
	const [page, setPage] = useState(1);
	const matches1400 = useMediaQuery('(max-width:1400px)');
	const matches1200 = useMediaQuery('(min-width:1200px)');

	//--------------FADE LOGIC----------------------------------
	const func = () => {
		setFade();
	};

	useEffect(() => {
		func();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maxWidth1200, maxWidth900, maxWidth600]);

	const handleChange = (event, value) => {
		func();
		setPage(value);
	};
	//-------------------FETCHING THE PRODUCTS ACCORDING TO PAGINATION--------------------------
	useEffect(() => {
		let limit;
		if (page === 1) {
			limit = 6 * page;
		} else {
			limit = 6 * (page - 1);
		}

		dispatch(fetch_products(limit, page));
	}, [dispatch, page]);
	//----------------------------------------------------------------------------

	const result = products.products.map((item, indx) => {
		return (
			<Grid
				key={indx}
				item
				xs={12}
				md={6}
				lg={4}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignContent: 'center'
				}}>
				<ProductItem {...item} />
			</Grid>
		);
	});
	return (
		<>
			<Stack
				alignItems='center'
				justifyContent='center'
				sx={{ p: 3, marginLeft: matches1400 && matches1200 ? 10 : 0 }}>
				{products.products.length > 0 ? (
					<Grid
						className={fadeIn}
						direction='row'
						container
						rowSpacing={3}
						columnSpacing={3}
						sx={{ width: '100%' }}>
						{result}
					</Grid>
				) : (
					<Typography
						textAlign='center'
						variant='h5'
						sx={{ fontFamily: 'Oleo Script Swash Caps', pr: 20 }}>
						No products
					</Typography>
				)}
				<Stack direction='row' justifyContent='center' sx={{ my: 4, pr: 0 }}>
					<Pagination
						count={products.productNumber}
						page={page}
						onChange={handleChange}
						size='large'
					/>
				</Stack>
			</Stack>
		</>
	);
};

export default ProductLayout;
