/** @format */
import React, { useEffect, useContext } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import one from './1.jpg';
import two from './2.jpg';
import three from './3.jpg';
import './index.scss';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clear_scroll, start_scroll } from '../../redux/UI/actions';
import '../../globalVariables.scss';
import useCustomFadeHook from '../../customHooks/customFadeHook';
import { Typography } from '@mui/material';
import { MainContext } from '../../Context';

const CarouselSection = () => {
	const { maxWidth1200, maxWidth600 } = useContext(MainContext);
	const { fadeIn, setFade } = useCustomFadeHook();
	const dispatch = useDispatch();
	const { scrollPos, barHeight, startScroll } = useSelector(
		(state) => state.UIData
	);
	const executeScroll = () => {
		dispatch(start_scroll);
	};

	useEffect(() => {
		setFade();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//------------EXECUTING THE SCROLL FUNCTION---------------------

	useEffect(() => {
		const equation = scrollPos.height - barHeight.height;
		if (scrollPos.bol && barHeight.bol && startScroll) {
			window.scroll({
				behavior: 'smooth',
				top: equation
			});
			dispatch(clear_scroll);
		}
		return () => {
			dispatch(clear_scroll);
		};
	}, [scrollPos, barHeight, dispatch, startScroll]);
	//----------------------------------------------------------------------
	const text = (
		<>
			<div className='divText'>
				<Typography
					sx={{
						fontFamily: 'Oleo Script Swash Caps',
						fontSize: !maxWidth600 ? 40 : 25
					}}>
					Change Your view for new oppurtunites
				</Typography>
			</div>
			{!maxWidth600 ? (
				<div onClick={() => executeScroll()} className='legend legend2'>
					<Typography
						sx={{
							fontSize: !maxWidth600 ? 20 : 15,
							fontFamily: 'Oleo Script Swash Caps'
						}}>
						Shop Now
					</Typography>
				</div>
			) : null}
		</>
	);

	return (
		<article className={fadeIn}>
			<Box
				sx={{
					maxWidth: 900,
					margin: 'auto',
					px: !maxWidth1200 ? 3.5 : !maxWidth600 ? 3.5 : 2,
					pt: !maxWidth1200 ? 3.5 : !maxWidth600 ? 3.5 : 2,
					bgcolor: 'rgb(246, 246, 246)',
					boxShadow: '10px 10px 10px rgb(204, 204, 204)'
				}}>
				<Carousel
					centerSlidePercentage={100}
					centerMode={true}
					className='caro'
					infiniteLoop={true}
					autoPlay={true}
					transitionTime={3}>
					<div className='divy'>
						<img className='img' src={one} alt='image1' />
						{text}
					</div>
					<div className='divy'>
						<img className='img' src={two} alt='image2' />
						{text}
					</div>
					<div className='divy'>
						<img className='img' src={three} alt='image3' />
						{text}
					</div>
				</Carousel>
			</Box>
		</article>
	);
};

export default CarouselSection;
