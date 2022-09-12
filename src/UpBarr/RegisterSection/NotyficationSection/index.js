/** @format */

import React, { useEffect, useContext, useState } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import { Badge } from '@mui/material';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useDispatch } from 'react-redux';
import {
	fetch_notyfication_start,
	set_marked
} from '../../../redux/UI/actions';
import { useSelector } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { MainContext } from '../../../Context';

const NotyficationSection = () => {
	const {
		user: { email },
		maxWidth600
	} = useContext(MainContext);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const noty = useSelector((state) => state.UIData.notyfications);
	const { comments } = useSelector((state) => state.UIData);
	const { myProducts } = useSelector((state) => state.productsData);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	//---------------CLOSING THE MENU WILL SET THE NOTYFICATIONS TO UNMARKED----
	const handleClose = () => {
		setAnchorEl(null);
		dispatch(set_marked(notIds, email));
	};

	//--------FETCH THE NOTYFICATIONS------------
	useEffect(() => {
		dispatch(fetch_notyfication_start(email));
	}, [comments, myProducts, dispatch, email]);
	//-------------------------------
	let count = 0;
	let notIds = [];
	const notData = noty.map((item, indx) => {
		notIds.push(item.id);
		if (item.marked === false) {
			count++;
		}
		if (item.type === 'comment') {
			return (
				<MenuItem
					onClick={() => {
						navigate(`/yourProduct/${item.productID}`);
						handleClose();
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
						navigate('/personalData');
						handleClose();
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
		<>
			<Tooltip title='Open Notyfications'>
				<IconButton
					onClick={handleClick}
					sx={{ my: 0, color: 'black', display: 'block' }}>
					<Badge badgeContent={count} color='primary'>
						<BookmarksIcon sx={{ fontSize: !maxWidth600 ? 25 : 20 }} />
					</Badge>
				</IconButton>
			</Tooltip>
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
		</>
	);
};

export default NotyficationSection;
