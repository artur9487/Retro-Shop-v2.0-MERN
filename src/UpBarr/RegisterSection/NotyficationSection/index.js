/** @format */

import React, { useEffect, useContext, useState } from 'react';
import { IconButton, Stack, Typography, Box } from '@mui/material';
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
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { MainContext } from '../../../Context';
import NotyficationData from './NotyficationData';
import { Outlet } from 'react-router-dom';
import { NotyficationContext } from '../../../Context';
import { useLocation } from 'react-router-dom';

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

	const location = useLocation();
	const { pathname } = location;
	let count = 0;
	/*	;
	let notIdsOrders = [];
	let notIdsComments = [];
	//---------------CLOSING THE MENU WILL SET THE NOTYFICATIONS TO UNMARKED----
	const handleClose = (productID, type) => {
		setAnchorEl(null);
		if (type === 'comment') {
			console.log(1);
			navigate(`/logged/${email}/${productID}`);
		} else if (type === 'order') {
			console.log(2);
			navigate(`/logged/${email}/personalData`);
		} else {
			console.log(3);
			navigate(-1);
		}
		dispatch(set_marked(notIdsOrders, notIdsComments, email));
	};

	const notData = noty.map((item, indx) => {
		if (item.marked === false) {
			count++;
			if (item.type === 'comment') {
				notIdsComments.push(item._id);
			} else {
				notIdsOrders.push(item._id);
			}
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
	});*/

	return (
		<>
			<Tooltip title='Open Notyfications'>
				<Link to={pathname + `/notyfications`}>
					<IconButton
						onClick={handleClick}
						sx={{ my: 0, color: 'black', display: 'block' }}>
						<Badge badgeContent={count} color='primary'>
							<BookmarksIcon sx={{ fontSize: !maxWidth600 ? 25 : 20 }} />
						</Badge>
					</IconButton>
				</Link>
			</Tooltip>

			<NotyficationContext.Provider
				value={{
					count,
					setAnchorEl,
					open,
					anchorEl
				}}>
				<Outlet />

				{/*	<Menu
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
					</Menu>*/}
			</NotyficationContext.Provider>
		</>
	);
};

export default NotyficationSection;
