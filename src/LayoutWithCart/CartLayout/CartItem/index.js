/** @format */

import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch } from 'react-redux';
import {
	add_to_cart,
	cart_down,
	delete_cart_item
} from '../../../redux/Products/actions';
import { IconButton, Typography } from '@mui/material';
import { Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = (item) => {
	const dispatch = useDispatch();
	const { productPrice, productName, count, id, indx } = item;

	const handleUp = () => {
		dispatch(add_to_cart(id));
	};

	const handleDown = () => {
		dispatch(cart_down(id));
	};

	const handleDelete = () => {
		dispatch(delete_cart_item(id));
	};

	return (
		<>
			<ListItem sx={{ mt: 2 }} disablePadding>
				<ListItemText
					primary={
						<Typography sx={{ fontFamily: 'Sofia', fontSize: 15 }}>{`${
							indx + 1
						}.`}</Typography>
					}
				/>
				<ListItemText
					sx={{ mr: 1 }}
					primary={
						<Typography sx={{ fontFamily: 'Sofia', fontSize: 17 }}>
							{productName}
						</Typography>
					}
				/>
				<ListItemText
					primary={
						<Typography sx={{ fontFamily: 'Sofia', fontSize: 15 }}>
							{productPrice}$
						</Typography>
					}
				/>
				<IconButton disableRipple={true} onClick={handleDown}>
					<KeyboardArrowDownIcon color='error' />
				</IconButton>
				<ListItemText
					primary={
						<Typography sx={{ fontFamily: 'Sofia' }}>{count} </Typography>
					}
				/>
				<IconButton disableRipple={true} onClick={handleUp}>
					<KeyboardArrowUpIcon color='primary' />
				</IconButton>
				<IconButton disableRipple={true} onClick={handleDelete}>
					<DeleteIcon color='error' />
				</IconButton>
			</ListItem>
			<Divider />
		</>
	);
};

export default CartItem;
