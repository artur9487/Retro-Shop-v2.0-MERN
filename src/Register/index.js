/** @format */

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Typography } from '@mui/material';
import { StartBar } from '../styledComp';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Stack } from '@mui/material';
import { register_user_start } from '../redux/Auth/actions';
import { useDispatch } from 'react-redux';
import useCustomFadeHook from '../customHooks/customFadeHook';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import { useSelector } from 'react-redux';
import { MainContext } from '../Context';
import { log_error_clean } from '../redux/Auth/actions';

const initErr = {
	password: false,
	email: false,
	confirmPassword: false
};

const Register = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const { fadeIn, setFade } = useCustomFadeHook();
	const { logError } = useSelector((state) => state.AuthData);
	const [passError, setPassError] = useState(false);
	const { user } = useContext(MainContext);

	const firstUpdate = useRef(true);

	//----------NAVIGATE TO HOME PAGE WHEN AN ERROR WILL OCCUR------
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

	//------------SETTING THE NEW USER AND VALIDATION LOGIC----------
	const handleChange = () => {
		setPassError(false);
		if (handleErrors() > 0) {
			return;
		}
		if (password === confirmPassword) {
			dispatch(log_error_clean);
			dispatch(register_user_start(email, password));
		} else {
			setPassError(true);
		}
	};

	//------------VALIDATION THE REGISTRATION LOGIC---------
	const handleErrors = () => {
		let errorsy = { ...initErr };
		let errorNum = 0;

		if (!password) {
			errorsy = { ...errorsy, password: true };
			errorNum++;
		}
		if (!confirmPassword) {
			errorsy = { ...errorsy, confirmPassword: true };
			errorNum++;
		}
		if (!email) {
			errorsy = { ...errorsy, email: true };
			errorNum++;
		}
		setError(errorsy);

		return errorNum;
	};

	//-------FADE IN LOGIC----------
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

	return (
		<>
			<section className={fadeIn}>
				<StartBar heightSmall={'300px'}>
					<Box
						component='form'
						sx={{
							width: '100%'
						}}
						noValidate
						autoComplete='off'>
						<Stack direction='column' spacing={3}>
							<Typography
								textAlign='center'
								sx={{ fontFamily: 'Sofia' }}
								variant='h4'>
								SignIn Panel
							</Typography>
							<TextField
								InputLabelProps={{
									style: {
										color: 'black',
										fontFamily: 'Sofia',
										fontStyle: 'italic',
										fontSize: 16
									}
								}}
								id='standard-basic'
								label='Email'
								variant='standard'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
							{error.email && (
								<Typography
									sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
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
								label='Confirm Password'
								variant='standard'
								onChange={(e) => setConfirmPassword(e.target.value)}
								value={confirmPassword}
							/>
							{error.confirmPassword && (
								<Typography
									sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
									Please put the confirm password in
								</Typography>
							)}
							{passError && confirmPassword && password && (
								<Typography
									sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
									The posswords doesnt match
								</Typography>
							)}
							{logError === 'Firebase: Error (auth/invalid-email).' &&
								!error.password &&
								!error.email &&
								!error.confirmPassword &&
								!passError && (
									<Typography
										textAlign='center'
										sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
										Invalid Email
									</Typography>
								)}
							{logError === 'Firebase: Error (auth/email-already-in-use).' &&
								!error.password &&
								!error.email &&
								!error.confirmPassword &&
								!passError && (
									<Typography
										textAlign='center'
										sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
										Account Already in Use
									</Typography>
								)}
							{logError ===
								'Firebase: Password should be at least 6 characters (auth/weak-password).' &&
								!error.password &&
								!error.email &&
								!error.confirmPassword &&
								!passError && (
									<Typography
										textAlign='center'
										sx={{ color: 'red', fontSize: 16, fontFamily: 'Sofia' }}>
										Password should have at least 6 characters
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
			<Box sx={{ width: '100%', position: 'absolute', bottom: -100 }}>
				<Footer />
			</Box>
		</>
	);
};

export default Register;
