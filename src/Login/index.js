/** @format */

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Typography } from '@mui/material';
import { StartBar } from '../styledComp';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { log_error_clean, login_user_start } from '../redux/Auth/actions';
import useCustomFadeHook from '../customHooks/customFadeHook';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import { useSelector } from 'react-redux';
import { MainContext } from '../Context';

const initErr = {
	password: false,
	email: false
};

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { fadeIn, setFade } = useCustomFadeHook();
	const { logError } = useSelector((state) => state.AuthData);
	const { user } = useContext(MainContext);

	const firstUpdate = useRef(true);

	//-------------NAVIGATE TO START PAGE IF LOGERROR IS TRUE----------
	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		} else {
			if (logError) {
				return;
			} else {
				navigate('/');
			}
		}
	}, [logError, user, navigate]);

	//---------------LOGIN------------------
	const handleChange = () => {
		if (handleErrors() > 0) {
			return;
		}
		dispatch(log_error_clean);
		dispatch(login_user_start(email, password));
	};

	//-------------FORM VALIDATION-------------
	const handleErrors = () => {
		let errorsy = { ...initErr };
		let errorNum = 0;

		if (!password) {
			errorsy = { ...errorsy, password: true };
			errorNum++;
		}
		if (!email) {
			errorsy = { ...errorsy, email: true };
			errorNum++;
		}
		setError(errorsy);

		return errorNum;
	};
	//--------FADE LOGIC----------------
	useEffect(() => {
		const func = () => {
			setFade();
		};
		func();
		return () => {
			dispatch(log_error_clean);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);
	//-----------------------------------
	return (
		<>
			<section className={fadeIn}>
				<StartBar heightSmall={'250px'}>
					<Box
						component='form'
						sx={{ width: '100%' }}
						noValidate
						autoComplete='off'>
						<Stack direction='column' spacing={3}>
							<Typography
								textAlign='center'
								sx={{ fontFamily: 'Sofia' }}
								variant='h4'>
								Login Panel
							</Typography>
							<TextField
								//className={classes.textField}
								InputLabelProps={{
									style: {
										color: 'black',
										fontFamily: 'Sofia',
										fontStyle: 'italic',
										fontSize: 16
									}
								}}
								focused={false}
								Input={{ color: 'secondary' }}
								id='standard-basic'
								label='Email'
								variant='standard'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
							{error.email && (
								<Typography
									sx={{
										color: 'red',
										fontSize: 16,
										fontFamily: 'Sofia'
									}}>
									Please put email in
								</Typography>
							)}
							<TextField
								InputLabelProps={{
									style: {
										color: 'black',
										fontFamily: 'Sofia',
										fontStyle: 'italic',
										fontSize: 16
									}
								}}
								focused={false}
								id='standard-basic'
								label='Password'
								variant='standard'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
							{error.password && (
								<Typography
									sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
									Please put password in
								</Typography>
							)}
							{logError === 'Firebase: Error (auth/invalid-email).' &&
								!error.password &&
								!error.email && (
									<Typography
										textAlign='center'
										sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
										Invalid email
									</Typography>
								)}
							{logError === 'Firebase: Error (auth/user-not-found).' &&
								!error.password &&
								!error.email && (
									<Typography
										textAlign='center'
										sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
										This account doesnt exist
									</Typography>
								)}
							{logError === 'Firebase: Error (auth/wrong-password).' &&
								!error.password &&
								!error.email && (
									<Typography
										textAlign='center'
										sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
										Wrong password
									</Typography>
								)}
							{logError ===
								'Firebase: Access to this account has been temporar…ou can try again later. (auth/too-many-requests).' &&
								!error.password &&
								!error.email && (
									<Typography
										textAlign='center'
										sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
										Too many requests
									</Typography>
								)}

							<Button
								color='inherit'
								sx={{
									textTransform: 'none',
									fontFamily: 'Oleo Script Swash Caps',
									fontSize: 25,
									p: 0
								}}
								variant='text'
								onClick={handleChange}>
								Log In
							</Button>
						</Stack>
					</Box>
				</StartBar>
			</section>
			<Box sx={{ width: '100%', position: 'absolute', bottom: -50 }}>
				<Footer />
			</Box>
		</>
	);
};

export default Login;
