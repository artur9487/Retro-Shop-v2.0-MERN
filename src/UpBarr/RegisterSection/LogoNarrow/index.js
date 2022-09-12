/** @format */

import React, { useState, useEffect, useContext } from 'react';
import {
	Stack,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useCustomFadeHook from '../../../customHooks/customFadeHook';
import { MainContext } from '../../../Context';

const LogoNarrow = ({
	handleOpenNavMenu,
	anchorElNav,
	handleCloseNavMenu,
	pages
}) => {
	const { maxWidth600, user } = useContext(MainContext);
	const { fadeIn, setFade } = useCustomFadeHook();
	const [matchState, setMatchState] = useState(false);
	const navigate = useNavigate();

	//-----------FADE IN LOGIC-----------
	useEffect(() => {
		setFade();
		setMatchState(!maxWidth600);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maxWidth600]);
	//------------------------
	return (
		<Stack
			className={fadeIn}
			direction='row'
			justifyContent='center'
			alignItems='center'
			sx={{
				flexGrow: 1,
				display: { xs: !matchState === false ? 'none' : 'flex', sm: 'none' }
			}}>
			{user ? (
				<Box>
					<IconButton
						aria-label='account of current user'
						aria-controls='menu-appbar'
						aria-haspopup='true'
						onClick={handleOpenNavMenu}
						color='inherit'>
						<MenuIcon sx={{ fontSize: 35 }} />
					</IconButton>
					<Menu
						id='menu-appbar'
						anchorEl={anchorElNav}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left'
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left'
						}}
						open={Boolean(anchorElNav)}
						onClose={handleCloseNavMenu}>
						{pages.map((page, indx) => (
							<MenuItem key={indx} onClick={handleCloseNavMenu}>
								<Link to={page.navLink} className='links'>
									<Typography
										sx={{ color: 'black', fontFamily: 'Sofia', fontSize: 20 }}
										textAlign='center'>
										{page.navName}
									</Typography>
								</Link>
							</MenuItem>
						))}
					</Menu>
				</Box>
			) : null}
			<Typography
				onClick={() => navigate('/')}
				className='text'
				variant='h5'
				noWrap
				component='div'
				sx={{
					mr: 15,
					color: 'black',
					cursor: 'pointer',
					fontStyle: 'italic',
					p: 1,
					display: 'block',
					fontSize: 35,
					fontFamily: 'Oleo Script Swash Caps'
				}}>
				RetroShop
			</Typography>
		</Stack>
	);
};

export default LogoNarrow;
