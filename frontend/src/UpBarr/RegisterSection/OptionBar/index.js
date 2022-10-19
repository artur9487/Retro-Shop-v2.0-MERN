/** @format */

import React, { useEffect, useState, useContext } from 'react';
import { Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import useCustomFadeHook from '../../../customHooks/customFadeHook';
import { MainContext } from '../../../Context';
import { useLocation } from 'react-router-dom';

const OptionBar = ({ handleCloseNavMenu, pages }) => {
	const { maxWidth600, user } = useContext(MainContext);
	const { fadeIn, setFade } = useCustomFadeHook();
	const [matchState, setMatchState] = useState(false);

	const location = useLocation();

	const { pathname } = location;

	const splitLocation = pathname.split('/');

	const url = splitLocation[splitLocation.length - 1];

	//----------FADE IN LOGIC---------------
	useEffect(() => {
		setFade();
		setMatchState(!maxWidth600);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maxWidth600]);

	return (
		<Stack
			className={fadeIn}
			sx={{
				flexGrow: 1,
				display: { xs: 'none', sm: matchState === false ? 'none' : 'flex' }
			}}
			direction='row'
			spacing={2}>
			{pages.map((item, indx) => (
				<Link
					key={indx}
					onClick={handleCloseNavMenu}
					to={
						item.navLink !== ''
							? `/api/logged/${user.email}/${item.navLink}`
							: `/api/logged/${user.email}`
					}
					className='links'>
					<Button
						color='inherit'
						key={item.navName}
						sx={{
							textTransform: 'none',
							fontSize: 20,
							my: 2,
							color: 'black',
							display: 'block',
							fontFamily: 'Sofia',
							fontStyle: 'Italic',
							fontWeight:
								item.navLink === '' && url === user.email
									? 1000
									: url === item.navLink
									? 1000
									: 100
						}}>
						{item.navName}
					</Button>
				</Link>
			))}
		</Stack>
	);
};

export default OptionBar;
