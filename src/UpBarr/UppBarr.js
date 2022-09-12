/** @format */

import React, { useEffect, useState, useRef, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { set_bar_height, toogle_cart } from '../redux/UI/actions';
import { sign_out } from '../redux/Auth/actions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import './index.scss';
import WhenLogged from './RegisterSection/WhenLogged';
import WhenUnlogged from './RegisterSection/WhenUnlogged';
import OptionBar from './RegisterSection/OptionBar';
import LogoWide from './RegisterSection/LogoWide';
import LogoNarrow from './RegisterSection/LogoNarrow';
import { MainContext } from '../Context';

const ResponsiveAppBar = () => {
	const { user, maxWidth600 } = useContext(MainContext);
	const myRef = useRef(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cartCount = useSelector((state) => state.productsData.cartCount);
	const startScroll = useSelector((state) => state.UIData.startScroll);
	const [anchorElNav, setAnchorElNav] = useState(null);

	const pages = [
		{ navName: 'All Products', navLink: '/' },
		{ navName: 'Personal Data', navLink: 'personalData' },
		{ navName: 'Your Products', navLink: 'yourProduct' }
	];
	//----SETTING THE BAR HEIGHT------------------
	useEffect(() => {
		if (startScroll) {
			dispatch(set_bar_height(myRef.current.offsetHeight));
		}
	}, [startScroll, dispatch]);

	//------CLOSING AND OPENING THE NAV MENU-------
	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	//------------TOOGLE THE CART-------
	const handleCart = () => {
		dispatch(toogle_cart);
	};

	//---------SIGN OUT----------------
	const handleSignOut = () => {
		navigate('/');
		dispatch(sign_out);
	};
	//---------------------------
	return (
		<AppBar
			sx={{ height: { xs: 100, sm: user ? 150 : 80 } }}
			ref={myRef}
			position='fixed'
			color='default'>
			<Container sx={{ height: '100%' }} maxWidth='xl'>
				<Toolbar sx={{ height: '100%' }} disableGutters>
					<Stack
						direction='column'
						alignItems='center'
						sx={{
							width: '100%',
							position: 'relative',
							height: '100%'
						}}>
						<Stack
							direction='column'
							justifyContent='center'
							alignItems='center'
							sx={{ mt: 2 }}>
							<LogoWide />
							{user && (
								<OptionBar
									handleCloseNavMenu={handleCloseNavMenu}
									pages={pages}
								/>
							)}
						</Stack>
						<LogoNarrow
							handleOpenNavMenu={handleOpenNavMenu}
							anchorElNav={anchorElNav}
							handleCloseNavMenu={handleCloseNavMenu}
							pages={pages}
						/>
						<Stack
							sx={{
								position: 'absolute',
								top: !maxWidth600 ? 15 : 0,
								right: 0,
								mt: 0
							}}>
							{user ? (
								<WhenLogged
									cartCount={cartCount}
									handleCart={handleCart}
									handleSignOut={handleSignOut}
								/>
							) : (
								<WhenUnlogged handleCloseNavMenu={handleCloseNavMenu} />
							)}
						</Stack>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default ResponsiveAppBar;
