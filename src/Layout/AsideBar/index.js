/** @format */

import React, { useState, useContext, useEffect } from 'react';
import './index.css';
import '../../globalVariables.scss';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { fetch_products, filter_products } from '../../redux/Products/actions';
import { Typography } from '@mui/material';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions } from '@mui/material';
import { DialogContent } from '@mui/material';
import { Stack } from '@mui/material';
import { MainContext } from '../../Context';
import useCustomFadeHook from '../../customHooks/customFadeHook';

const data = [
	{
		title: 'Set Category',
		options: ['Electronics', 'Clothes', 'Others'],
		open: false,
		height: 150
	},
	{ title: 'Set price range', open: false, height: 150 },
	{
		title: 'Set Rating',
		options: [
			'Above 4 stars',
			'Above 3 stars',
			'Above 2 stars',
			'Above 1 star'
		],
		open: false,
		height: 230
	}
];

const AsideBar = () => {
	const { maxWidth1200 } = useContext(MainContext);
	const dispatch = useDispatch();
	const [category, setCategory] = useState('');
	const [value, setValue] = useState([20, 37]);
	const [rating, setRating] = useState(0);
	const [rating2, setRating2] = useState('');
	const [open, setOpen] = useState(data);
	const [openDialog, setOpenDialog] = useState(false);
	const { fadeIn, setFade } = useCustomFadeHook();
	const [matchState, setMatchState] = useState(false);
	const [err, setErr] = useState(false);
	const [displayState, setDisplayState] = useState(false);
	const OleoFont = 'Oleo Script Swash Caps';

	//----------------FADE IN EFFECT DURING VIEWPORT CHANGES---------------
	useEffect(() => {
		setFade();
		setMatchState(!maxWidth1200);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maxWidth1200]);
	//-----------------LOGIC TO SUBSCRIBE THE VALUES TO DIFFERENT VARIABLES----------------------

	const handleChange = (type, option) => {
		if (type === data[0].title) {
			setCategory(option);
		} else if (type === data[2].title) {
			let option2;
			switch (option) {
				case 'Above 4 stars':
					option2 = 4;
					break;
				case 'Above 3 stars':
					option2 = 3;
					break;
				case 'Above 2 stars':
					option2 = 2;
					break;
				case 'Above 1 star':
					option2 = 1;
					break;
				default:
					break;
			}
			setRating(option2);
			setRating2(option);
		}
	};

	const handlePrice = (event, newValue) => {
		setValue(newValue);
	};

	const submitFilter = () => {
		if (category === '' || rating === 0) {
			setErr(true);
			return;
		}
		dispatch(filter_products(category, value, rating));
		setDisplayState(true);
		setErr(false);
	};

	const resetFilter = () => {
		dispatch(fetch_products(6, 1));
		setDisplayState(false);
	};
	//----------------TOOGLE THE BAR TO OPEN OR CLOSE---------------
	const handleOpen = (title) => {
		const proOpen = [...open];
		const id = proOpen.findIndex((item) => {
			return item.title === title;
		});
		if (proOpen[id].open === true) {
			proOpen[id].open = false;
		} else {
			proOpen[id].open = true;
		}
		setOpen(proOpen);
	};
	//------------------OPEN AND CLOSE DIALOG---------------------
	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = (value) => {
		setOpenDialog(false);
	};
	//------------------------SEGMENT WITH THE VALUES-------------------
	const DownSegment = ({ item }) => {
		return item.options ? (
			item.options.map((option) => {
				return (
					<Button
						color='inherit'
						sx={{ textTransform: 'none' }}
						key={option}
						onClick={() => handleChange(item.title, option)}>
						<Typography
							sx={{
								fontFamily: 'Sofia',
								fontSize: 17,
								fontWeight:
									category === option || rating2 === option ? 1000 : 100
							}}
							color='black'>
							{option}
						</Typography>
					</Button>
				);
			})
		) : (
			<Box sx={{ width: '80%', margin: 'auto' }}>
				<Slider
					getAriaLabel={() => 'Price range'}
					value={value}
					onChange={handlePrice}
					valueLabelDisplay='auto'
					size='small'
					sx={{ color: 'black' }}
				/>
				<Typography
					sx={{
						fontFamily: 'Sofia',
						fontSize: 14
					}}
					variant='body2'>
					{value[0]}$-{value[1]}$
				</Typography>
			</Box>
		);
	};
	//------------------------SEGMENT WITH THE TITLE ON BIG SCREEN -------------------
	const FilterPanel = open.map((item, indx) => {
		return (
			<FilterSegment key={indx} isOpen={item.open} height={item.height}>
				<UpperFilterSegment onClick={() => handleOpen(item.title)}>
					<Typography
						sx={{
							fontFamily: 'Sofia',
							fontSize: 20,
							fontStyle: 'italic'
						}}>
						{item.title}
					</Typography>
					<Box sx={{ position: 'absolute', right: 0, top: 0 }}>
						{!item.open ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
					</Box>
				</UpperFilterSegment>
				<DownFilterSegment>
					<DownSegment item={item} />
				</DownFilterSegment>
			</FilterSegment>
		);
	});
	//------------------------SEGMENT WITH THE TITLE ON SMALL SCREEN -------------------
	const FilterPanel2 = open.map((item, indx) => {
		return (
			<FilterSegment key={indx} isOpen={true}>
				<UpperFilterSegment
					clickable={maxWidth1200}
					onClick={() => handleOpen(item.title)}>
					<Typography
						sx={{
							fontFamily: 'Sofia',
							fontSize: 22,
							fontStyle: 'italic'
						}}
						variant='body1'>
						{item.title}
					</Typography>
				</UpperFilterSegment>
				<DownFilterSegment>
					<DownSegment item={item} />
				</DownFilterSegment>
			</FilterSegment>
		);
	});

	return (
		<aside>
			{matchState ? (
				<Box
					className={fadeIn}
					sx={{
						minHeight: 350,
						width: 200,
						margin: 'auto',
						boxShadow: '2px 2px 7px rgb(204, 204, 204)',
						p: 4
					}}>
					<Typography
						sx={{
							fontFamily: OleoFont,
							fontSize: 30,
							fontStyle: 'italic'
						}}
						textAlign='center'
						variant='h4'>
						Filter Bar
					</Typography>
					{FilterPanel}
					{err ? (
						<Typography
							textAlign='center'
							sx={{ mb: 1, color: 'red', fontFamily: OleoFont, fontSize: 17 }}>
							Set All Fields
						</Typography>
					) : null}
					<Stack direction='column' spacing={1} alignItems='center'>
						<Typography
							onClick={submitFilter}
							sx={{
								p: 1,
								cursor: 'pointer',
								fontFamily: OleoFont,
								fontSize: 22,
								fontStyle: 'italic',
								display: displayState ? 'none' : 'block'
							}}
							textAlign='center'
							variant='h4'>
							Submit Filter
						</Typography>
						<Typography
							onClick={resetFilter}
							sx={{
								p: 1,
								cursor: 'pointer',
								fontFamily: OleoFont,
								fontSize: 22,
								fontStyle: 'italic'
							}}
							textAlign='center'
							variant='h4'>
							Reset Filter
						</Typography>
					</Stack>
				</Box>
			) : (
				<>
					<Stack
						className={fadeIn}
						justifyContent='center'
						sx={{
							height: 100,
							width: 200,
							margin: 'auto'
						}}>
						<UpperFilterSegment
							clickable={maxWidth1200}
							onClick={handleClickOpen}>
							<Typography
								variant='typography'
								onClick={setOpenDialog}
								sx={{
									textTransform: 'none',
									py: 2,
									textAlign: 'center',
									borderBottom: 2,
									borderColor: '#e0e0e0',
									display: 'block',
									position: 'relative',
									cursor: 'pointer',
									width: '100%',
									fontFamily: OleoFont,
									fontSize: 25,
									fontStyle: 'italic'
								}}>
								Open Filter Bar
							</Typography>
						</UpperFilterSegment>
						<Typography
							sx={{
								p: 2,
								textTransform: 'none',
								fontFamily: OleoFont,
								fontSize: 20
							}}
							textAlign='center'
							onClick={resetFilter}>
							Reset Filter
						</Typography>
					</Stack>
					<Dialog
						sx={{ maxWidth: 400, margin: 'auto' }}
						onClose={handleClose}
						open={openDialog}>
						<DialogTitle
							sx={{
								fontFamily: OleoFont,
								fontSize: 30,
								textAlign: 'center'
							}}>
							Filter Panel
						</DialogTitle>
						<DialogContent>
							{FilterPanel2}
							{err ? (
								<Typography
									textAlign='center'
									sx={{ color: 'red', fontFamily: OleoFont, fontSize: 15 }}>
									Set All Fields
								</Typography>
							) : null}
						</DialogContent>
						<DialogActions>
							<Stack
								sx={{ width: '100%' }}
								spacing={3}
								direction='row'
								justifyContent='center'>
								<Typography
									onClick={submitFilter}
									sx={{
										cursor: 'pointer',
										textTransform: 'none',
										fontFamily: OleoFont,
										fontSize: 22,
										display: displayState ? 'none' : 'block'
									}}
									variant='outline'>
									Submit Filter
								</Typography>
								<Typography
									onClick={handleClose}
									sx={{
										cursor: 'pointer',
										textTransform: 'none',
										fontFamily: OleoFont,
										fontSize: 22
									}}
									variant='outline'>
									Close Filter
								</Typography>
							</Stack>
						</DialogActions>
					</Dialog>
				</>
			)}
		</aside>
	);
};

const FilterSegment = styled.div`
	margin: 2rem 0;
	text-align: center;
	border-bottom: 2px solid #e0e0e0;
	height: ${(props) => {
		return props.height === 230 && props.isOpen === true
			? '230px'
			: props.isOpen === true
			? '150px'
			: '50px';
	}};
	overflow: hidden;
	transition: linear all 0.5s;
`;

const UpperFilterSegment = styled.div`
	position: relative;
	display: block;
	cursor: ${(props) => {
		return props.clickable === true ? 'cursor' : 'pointer';
	}};
`;

const DownFilterSegment = styled.div`
	margin-top: 2rem;
`;

export default AsideBar;
