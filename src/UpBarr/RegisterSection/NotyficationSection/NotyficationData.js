/** @format */

import React, { useContext } from 'react';
import { MenuItem, Menu } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { MainContext } from '../../../Context';
import { NotyficationContext } from '../../../Context';
import { useSelector } from 'react-redux';
import { Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set_marked } from '../../../redux/UI/actions';

const NotyficationData = () => {
	const {
		maxWidth600,
		user: { email }
	} = useContext(MainContext);
	const { setAnchorEl, open, anchorEl, count } =
		useContext(NotyficationContext);
	const noty = useSelector((state) => state.UIData.notyfications);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleClose = (productID, type) => {
		setAnchorEl(null);
		if (type === 'commnent') {
			navigate(`/logged/${email}/${productID}`);
		} else if (type === 'order') {
			navigate(`/logged/${email}/personalData`);
		} else {
			navigate(-1);
		}
		dispatch(set_marked(notIdsOrders, notIdsComments, email));
	};

	let notIdsOrders = [];
	let notIdsComments = [];

	const notData = noty.map((item, indx) => {
		if (item.type === 'commnent') {
			notIdsComments.push(item._id);
		} else {
			notIdsOrders.push(item._id);
		}

		if (item.marked === false) {
			count++;
		}
		if (item.type === 'comment') {
			return (
				<MenuItem
					onClick={() => {
						handleClose(item.productID, item.type);
					}}
					key={indx}
					divider={true}>
					<Stack direction='row' alignItems='center' spacing={1} sx={{ my: 1 }}>
						<Typography
							sx={{
								fontFamily: 'Sofia',
								fontSize: !maxWidth600 ? 18 : 16,
								fontWeight: 1000
							}}
							variant='body2'>
							{item.sender}
						</Typography>
						<Typography
							sx={{ fontFamily: 'Sofia', fontSize: !maxWidth600 ? 18 : 16 }}
							variant='body2'>
							has commented your product!
						</Typography>
						{!item.marked && <ArrowCircleLeftIcon />}
					</Stack>
				</MenuItem>
			);
		} else if (item.type === 'order') {
			return (
				<MenuItem
					onClick={() => {
						handleClose(item.productID, item.type);
					}}
					key={indx}
					divider={true}>
					<Stack direction='row' alignItems='center' spacing={1} sx={{ my: 1 }}>
						<Typography
							sx={{
								fontFamily: 'Sofia',
								fontSize: !maxWidth600 ? 18 : 16,
								fontWeight: 1000
							}}
							variant='body2'>
							{item.buyer}
						</Typography>
						<Typography
							sx={{ fontFamily: 'Sofia', fontSize: !maxWidth600 ? 18 : 16 }}
							variant='body2'>
							has bought your product!
						</Typography>
						{!item.marked && <ArrowCircleLeftIcon />}
					</Stack>
				</MenuItem>
			);
		}
	});
	return (
		<Menu
			id='basic-menu'
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			MenuListProps={{
				'aria-labelledby': 'basic-button'
			}}
			PaperProps={{
				style: {
					maxHeight: '30ch',
					width: '45ch'
				}
			}}>
			{noty.length === 0 ? (
				<Typography
					textAlign='center'
					sx={{ fontFamily: 'Sofia', fontSize: 18 }}
					variant='body2'>
					No notyfication yet
				</Typography>
			) : (
				notData
			)}
		</Menu>
	);
};

export default NotyficationData;
