/** @format */

import React, { useContext } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Context } from '../../Context';
import { Rating } from '@mui/material';
import '../../globalVariables.scss';
import styled from 'styled-components';

const ProductSection = () => {
	const {
		maxWidth600,
		product,
		handleAdd,
		count,
		setCount,
		user,
		fadeIn,
		pathname,
		productID
	} = useContext(Context);

	const OleoFont = 'Oleo Script Swash Caps';

	const {
		productName,
		productPrice,
		ratingValue,
		ratingCount,
		image,
		productQuantity,
		email,
		category
	} = product[0];

	//---------------FIXING THE RATING VALUE-----------
	const fixedNum = Math.round(ratingValue * 2) / 2;
	//---------------------------------------

	const CustomRow = ({ data1, data2 }) => {
		return (
			<Stack direction='row' spacing={1}>
				<Typography sx={{ fontFamily: 'Sofia', color: 'grey' }}>
					{data1}
				</Typography>
				<Typography
					sx={{ fontFamily: 'Sofia', color: 'grey', fontWeight: 1000 }}>
					{data2}
				</Typography>
			</Stack>
		);
	};

	const obj = [
		{ data1: 'From the user: ', data2: email },
		{ data1: 'Category: ', data2: category },
		{ data1: 'Price: ', data2: `${productPrice}$` }
	];

	return (
		<Stack
			className={fadeIn}
			direction='column'
			spacing={2}
			sx={{ width: !maxWidth600 ? '60%' : '100%' }}>
			<Box
				sx={{
					borderRadius: 5,
					overflow: 'hidden',
					maxWidth: 350
				}}>
				<img
					style={{
						objectFit: 'contain',
						width: '100%',
						height: '100%'
					}}
					src={image}
					alt='productImage'
				/>
			</Box>
			<Typography sx={{ fontFamily: OleoFont }} variant='h4'>
				{productName}
			</Typography>
			{obj.map((item, indx) => {
				const { data1, data2 } = item;
				return <CustomRow key={indx} data1={data1} data2={data2} />;
			})}
			<Stack spacing={1} direction='row'>
				<Rating name='read-only' value={fixedNum} readOnly />
				<Typography sx={{ fontFamily: 'Sofia' }}>
					of {ratingCount} ratings
				</Typography>
			</Stack>
			{user && pathname !== `/yourProduct/${productID}` && (
				<>
					<Stack direction='row' alignItems='center' spacing={2}>
						<CustomTextField
							color='primary'
							sx={{ width: 70 }}
							size='small'
							required
							type='number'
							value={count}
							InputProps={{ inputProps: { min: 0, max: productQuantity } }}
							onChange={(e) => setCount(e.target.value)}
						/>
						<Typography
							sx={{ fontFamily: 'Sofia', fontSize: 15 }}
							component='span'>
							from {productQuantity} pieces
						</Typography>
					</Stack>
					<Stack direction='row' justifyContent='center'>
						<Button
							color='inherit'
							sx={{
								margin: 'auto',
								fontFamily: OleoFont,
								fontSize: 20,
								width: '40%',
								textTransform: 'none',
								color: 'black'
							}}
							onClick={handleAdd}>
							Add to cart!
						</Button>
					</Stack>
				</>
			)}
		</Stack>
	);
};

export default ProductSection;

const CustomTextField = styled(TextField)`
	& .MuiOutlinedInput-root {
		&.Mui-focused fieldset {
			border-color: black;
		}
	}
`;
