/** @format */

import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Context } from '../Context';
import { Button, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import './index.scss';
import styled from 'styled-components';
import noPhoto from '.././assets/no_photo.jpg';

const DialogComp = () => {
	const {
		image,
		open,
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
		handlePrice,
		handleQuan
	} = useContext(Context);

	const {
		imageErr,
		productNameErr,
		productPriceErr,
		productQuantityErr,
		categoryErr
	} = errors;

	return (
		<Dialog maxWidth='lg' open={open} onClose={handleClose}>
			<DialogContent sx={{ width: 600 }}>
				<Stack direction='row'>
					<Stack
						direction='column'
						justifyContent='space-evenly'
						sx={{ width: '55%' }}
						alignItems='center'>
						<Box
							sx={{
								display: 'block',
								height: 200,
								width: '80%'
							}}>
							{image ? (
								<img
									style={{ objectFit: 'contain' }}
									className='myImg'
									src={image}
								/>
							) : (
								<img
									style={{ objectFit: 'contain' }}
									className='myImg'
									src={noPhoto}
								/>
							)}
						</Box>
						<form>
							<label htmlFor='inpImg' className='inpImgCss'>
								Set Image
							</label>
							<input
								id='inpImg'
								type='file'
								onChange={(e) => onFileChange(e)}
							/>
						</form>
						{imageErr && (
							<Typography sx={{ color: 'red', fontFamily: 'Sofia' }}>
								No image selected
							</Typography>
						)}
					</Stack>

					<Stack direction='column' spacing={1} sx={{ width: '45%' }}>
						<Stack direction='column'>
							<CustomTextField
								InputLabelProps={{
									style: {
										color: 'black',
										fontFamily: 'Sofia',
										fontStyle: 'italic',
										fontSize: 15
									}
								}}
								error={productNameErr === true ? true : false}
								color='info'
								margin='dense'
								id='productName'
								label='Product name'
								type='text'
								fullWidth
								variant='outlined'
								value={productName}
								onChange={(e) => setProductName(e.target.value)}
							/>
							{productNameErr === true ? (
								<Typography
									component='div'
									sx={{ color: 'red', fontFamily: 'Sofia', fontSize: 13 }}>
									No product selected
								</Typography>
							) : null}
						</Stack>
						<Stack spacing={2} direction='row' alignItems='center'>
							<Stack sx={{ width: '50%' }} direction='column'>
								<CustomTextField
									InputLabelProps={{
										style: {
											color: 'black',
											fontFamily: 'Sofia',
											fontStyle: 'italic',
											fontSize: 15
										}
									}}
									error={productPriceErr === true ? true : false}
									margin='dense'
									id='price'
									InputProps={{ inputprops: { min: 0 } }}
									label='Price ($)'
									type='number'
									variant='outlined'
									step='0.01'
									value={productPrice}
									onChange={(e) => handlePrice(parseFloat(e.target.value))}
								/>
								{productPriceErr === true ? (
									<Typography
										component='div'
										sx={{ color: 'red', fontFamily: 'Sofia', fontSize: 13 }}>
										Invalid Price
									</Typography>
								) : null}
							</Stack>
							<Stack sx={{ width: '50%' }} direction='column'>
								<CustomTextField
									InputLabelProps={{
										style: {
											color: 'black',
											fontFamily: 'Sofia',
											fontStyle: 'italic',
											fontSize: 15
										}
									}}
									error={productQuantityErr === true ? true : false}
									margin='dense'
									id='quantity'
									label='Quantity'
									type='number'
									variant='outlined'
									InputProps={{ inputprops: { min: 1 } }}
									value={productQuantity}
									onChange={(e) => handleQuan(parseInt(e.target.value))}
								/>
								{productQuantityErr === true ? (
									<Typography
										component='div'
										sx={{ color: 'red', fontFamily: 'Sofia', fontSize: 13 }}>
										Invalid Quantity
									</Typography>
								) : null}
							</Stack>
						</Stack>
						<CustomFormField
							inputprops={{
								style: {
									color: 'black',
									fontFamily: 'Sofia',
									fontStyle: 'italic',
									fontSize: 15
								}
							}}>
							<InputLabel
								focused={false}
								sx={{
									fontFamily: 'Sofia',
									color: 'black',
									fontStyle: 'italic'
								}}
								id='demo-simple-select-label'>
								Category
							</InputLabel>
							<Select
								error={categoryErr === true ? true : false}
								value={category}
								labelId='demo-simple-select-label'
								onChange={(e) => setCategory(e.target.value)}
								id='demo-simple-select'
								label='Chose Category'
								inputprops={{
									name: 'max-width',
									id: 'max-width'
								}}>
								<MenuItem sx={{ fontFamily: 'Sofia' }} value={false}>
									Select Category
								</MenuItem>
								<MenuItem sx={{ fontFamily: 'Sofia' }} value='Electronics'>
									Electronics
								</MenuItem>
								<MenuItem sx={{ fontFamily: 'Sofia' }} value='Clothes'>
									Clothes
								</MenuItem>
								<MenuItem sx={{ fontFamily: 'Sofia' }} value='Others'>
									Others
								</MenuItem>
							</Select>
							{categoryErr && (
								<Typography
									sx={{ color: 'red', fontFamily: 'Sofia', fontSize: 13 }}>
									No category selected
								</Typography>
							)}
						</CustomFormField>
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					color='inherit'
					sx={{
						fontSize: 20,
						color: 'black',
						textTransform: 'none',
						fontFamily: 'Oleo Script Swash Caps'
					}}
					onClick={handleClose}>
					Cancel
				</Button>
				{type === 'add' ? (
					<Button
						color='inherit'
						sx={{
							fontSize: 20,
							color: 'black',
							textTransform: 'none',
							fontFamily: 'Oleo Script Swash Caps'
						}}
						onClick={handleSubmit}>
						Subscribe
					</Button>
				) : (
					<Button
						color='inherit'
						sx={{
							fontSize: 20,
							color: 'black',
							textTransform: 'none',
							fontFamily: 'Oleo Script Swash Caps'
						}}
						onClick={() => handleSubmitUpdate()}>
						Update
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

const CustomTextField = styled(TextField)`
	& .MuiOutlinedInput-root {
		&.Mui-focused fieldset {
			border-color: black;
		}
	},	
`;

const CustomFormField = styled(FormControl)`
	& .MuiOutlinedInput-root {
		&.Mui-focused fieldset {
			border-color: black;
		}
	},	
`;

export default DialogComp;
