/** @format */

import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useContext
} from 'react';
import AsideBar from './AsideBar';
import ProductLayout from './ProductLayout';
import { Outlet } from 'react-router-dom';
import { Stack, Grid, Box, Typography } from '@mui/material';
import CarouselSection from './Carousel';
import Footer from '../Footer';
import '../globalVariables.scss';
import { MainContext } from '../Context';
import { execute_scroll } from '../redux/UI/actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const Layout = () => {
	const { maxWidth1200, maxWidth600 } = useContext(MainContext);
	const dispatch = useDispatch();
	//----------------------------FADE IN DURING SCROLLING -------------------------------
	const myRef = useRef(null);
	const myRefek = useRef(null);
	const startScroll = useSelector((state) => state.UIData.startScroll);
	const [fadeIn, setFadeIn] = useState('noFade');
	const [scrollPosition, setScrollPosition] = useState();
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);
	function getWindowDimensions() {
		const { innerHeight: height } = window;
		return {
			height
		};
	}
	const handleScroll = useCallback(() => {
		setScrollPosition(myRefek.current.getBoundingClientRect().y);
	}, []);

	const handleResize = useCallback(() => {
		setWindowDimensions(getWindowDimensions());
	}, []);

	useEffect(() => {
		window.addEventListener('resize', handleResize, true);
		window.addEventListener('scroll', handleScroll, true);
		return () => {
			window.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('resize', handleResize, true);
		};
	}, [handleResize, handleScroll]);

	useEffect(() => {
		if (startScroll) {
			dispatch(execute_scroll(myRef.current.offsetTop));
		}
	}, [startScroll, dispatch]);

	useEffect(() => {
		if (Number(windowDimensions.height) > Number(scrollPosition + 200)) {
			setTimeout(() => setFadeIn('fadeIn'), 1000, true);
			window.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('resize', handleResize, true);
		}
	}, [scrollPosition, windowDimensions, handleResize, handleScroll]);

	//-------------------------------------------------------------------------

	return (
		<>
			<div className='container container2 '>
				<Stack
					sx={{ width: '100%', minHeight: '100vh', margin: 'auto' }}
					direction='column'>
					<CarouselSection />
					<Box sx={{ mt: !maxWidth600 ? 3 : 0 }} ref={myRef}>
						<Box sx={{ width: '100%' }} ref={myRefek} className={fadeIn}>
							<Stack
								sx={{ p: 4, ml: !maxWidth1200 ? 25 : 0 }}
								justifyContent='center'
								alignItems='center'
								direction='row'>
								<Box
									sx={{
										bgcolor: 'black',
										height: 3,
										width: !maxWidth600 ? 200 : 50,
										borderRadius: 5
									}}
								/>
								<Typography
									variant={'h4'}
									textAlign='center'
									sx={{
										fontFamily: 'Oleo Script Swash Caps',
										p: !maxWidth600 ? 2 : 1
									}}>
									Chose Your style
								</Typography>
								<Box
									sx={{
										bgcolor: 'black',
										height: 3,
										width: !maxWidth600 ? 200 : 50,
										borderRadius: 5
									}}
								/>
							</Stack>
							<Grid
								direction={maxWidth1200 ? 'column' : 'row'}
								container
								spacing={1}>
								<Grid item xs={2}>
									<AsideBar />
								</Grid>
								<Grid item xs={10}>
									<ProductLayout />
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Stack>
				<Outlet />
			</div>
			<Footer />
		</>
	);
};

export default Layout;
