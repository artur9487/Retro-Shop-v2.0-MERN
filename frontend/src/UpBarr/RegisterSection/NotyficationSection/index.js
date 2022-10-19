/** @format */

import React, { useContext, useState } from 'react';
import { IconButton } from '@mui/material';
import { Badge } from '@mui/material';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { MainContext } from '../../../Context';
import { Outlet } from 'react-router-dom';
import { NotyficationContext } from '../../../Context';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toogle_notyfication } from '../../../redux/UI/actions';
import { useEffect } from 'react';

const NotyficationSection = () => {
	const {
		user: { email },
		maxWidth600
	} = useContext(MainContext);
	const dispatch = useDispatch();
	const [anchorEl, setAnchorEl] = useState(null);
	const noty = useSelector((state) => state.UIData.notyfications);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const location = useLocation();
	const { pathname } = location;

	useEffect(() => {
		dispatch(toogle_notyfication);
	}, [dispatch, open]);

	const count = noty.reduce((a, b) => {
		if (b.marked === false) {
			return a + 1;
		} else {
			return a + 0;
		}
	}, 0);

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
					setAnchorEl,
					anchorEl,
					open
				}}>
				{pathname === `/api/logged/${email}/yourProduct/newProduct` ||
				pathname === `/api/logged/${email}/yourProduct/updateProduct` ? null : (
					<Outlet />
				)}
			</NotyficationContext.Provider>
		</>
	);
};

export default NotyficationSection;
