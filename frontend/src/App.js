/** @format */

import './App.scss';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AllProducts from './Layout';
import MyProducts from './myProductLayout';
import Login from './Login';
import Register from './Register';
import ProductDetails from './ProductDetails';
import PersonalData from './PersonalData/index';
import CompleteApp from './CompleteApp';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { MainContext } from './Context';
import { useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_current_user_end, sign_out } from './redux/Auth/actions';
import { useEffect, useState } from 'react';
import DialogComp from './myProductLayout/Dialog';
import NotyficationData from './UpBarr/RegisterSection/NotyficationSection/NotyficationData';
import CartLayout from './LayoutWithCart/CartLayout';

function App() {
	const theme = createTheme({
		typography: {
			button: {
				textTransform: 'none'
			}
		}
	});
	const dispatch = useDispatch();
	const user = useSelector((state) => state.AuthData.user);
	const maxWidth1200 = useMediaQuery('(max-width:1199px)');
	const maxWidth900 = useMediaQuery('(max-width:899px)');
	const maxWidth600 = useMediaQuery('(max-width:599px)');
	const navigate = useNavigate();

	axios.defaults.baseURL = 'https://retro-shop-v2-0-mern.onrender.com';
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		const token = localStorage.FBIdToken;
		const userStorage = localStorage.user;
		const userData = { email: userStorage };
		if (token) {
			const decodedToken = jwtDecode(token);
			if (decodedToken.exp * 1000 < Date.now()) {
				dispatch(sign_out);
				navigate(`/api`);
				setIsAuthorized(false);
			} else {
				if (!userData) {
					dispatch(set_current_user_end(userData));
				}
				axios.defaults.headers.common['Authorization'] = token;
				setIsAuthorized(true);
			}
		}
	}, [navigate, user, dispatch]);

	return (
		<ThemeProvider theme={theme}>
			<MainContext.Provider
				value={{
					user,
					maxWidth1200,
					maxWidth900,
					maxWidth600
				}}>
				<RouteCompo>
					<Routes>
						<Route
							exact
							path='/'
							element={
								<CompleteApp>
									<AllProducts />
								</CompleteApp>
							}></Route>
						<Route
							exact
							path='/api'
							element={
								<CompleteApp>
									<AllProducts />
								</CompleteApp>
							}>
							<Route path=':productID' element={<ProductDetails />} />
						</Route>
						<Route
							exact
							path='api/logged/:user'
							element={
								isAuthorized ? (
									<CompleteApp>
										<AllProducts />
									</CompleteApp>
								) : (
									<Navigate replace to='/api/login' />
								)
							}>
							<Route path=':productID' element={<ProductDetails />} />
							<Route path='order' element={<CartLayout />} />
							<Route path='notyfications' element={<NotyficationData />} />
						</Route>
						<Route
							path='api/logged/:user/yourProduct'
							element={
								isAuthorized ? (
									<CompleteApp>
										<MyProducts />
									</CompleteApp>
								) : (
									<Navigate replace to='/api/login' />
								)
							}>
							<Route path=':productID' element={<ProductDetails />} />
							<Route path='updateProduct' element={<DialogComp />} />
							<Route path='newProduct' element={<DialogComp />} />
							<Route path='notyfications' element={<NotyficationData />} />
							<Route path='order' element={<CartLayout />} />
						</Route>
						<Route
							path='api/logged/:user/personalData'
							element={
								isAuthorized ? (
									<CompleteApp>
										<PersonalData />
									</CompleteApp>
								) : (
									<Navigate replace to='/api/login' />
								)
							}>
							<Route path='notyfications' element={<NotyficationData />} />
							<Route path='order' element={<CartLayout />} />
						</Route>
						<Route
							path='api/Login'
							element={
								<CompleteApp>
									<Login />
								</CompleteApp>
							}
						/>
						<Route
							path='api/Register'
							element={
								<CompleteApp>
									<Register />
								</CompleteApp>
							}
						/>
					</Routes>
				</RouteCompo>
			</MainContext.Provider>
		</ThemeProvider>
	);
}

const RouteCompo = styled.div`
	position: relative;
`;

export default App;
