/** @format */

import './App.scss';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AllProducts from './Layout';
import MyProducts from './myProductLayout';
import LayoutWithCart from './LayoutWithCart';
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

	axios.defaults.baseURL = 'http://localhost:3000';
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		const token = localStorage.FBIdToken;
		const userStorage = localStorage.user;
		const userData = { email: userStorage };
		if (token) {
			const decodedToken = jwtDecode(token);
			if (decodedToken.exp * 1000 < Date.now()) {
				dispatch(sign_out);
				navigate(`/`);
				setIsAuthorized(false);
			} else {
				if (!userData) {
					dispatch(set_current_user_end(userData));
				}
				axios.defaults.headers.common['Authorization'] = token;
				setIsAuthorized(true);
			}
		}
	}, [navigate, user]);

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
						<Route path='/' element={<CompleteApp />}>
							<Route
								exact
								path='/'
								element={
									<LayoutWithCart>
										<AllProducts />
									</LayoutWithCart>
								}>
								<Route exact path=':productID' element={<ProductDetails />} />
							</Route>
							<Route
								exact
								path='logged/:user'
								element={
									isAuthorized ? (
										<LayoutWithCart>
											<AllProducts />
										</LayoutWithCart>
									) : (
										<Navigate replace to='/login' />
									)
								}
							/>
							<Route
								exact
								path='logged/:user/:productID'
								element={
									isAuthorized ? (
										<ProductDetails />
									) : (
										<Navigate replace to='/login' />
									)
								}
							/>

							<Route
								path='logged/:user/order'
								element={
									isAuthorized ? (
										<LayoutWithCart>
											<AllProducts />
										</LayoutWithCart>
									) : (
										<Navigate replace to='/login' />
									)
								}></Route>
							<Route
								path='logged/:user/yourProduct'
								element={
									isAuthorized ? (
										<LayoutWithCart>
											<MyProducts />
										</LayoutWithCart>
									) : (
										<Navigate replace to='/login' />
									)
								}>
								<Route path=':productID' element={<ProductDetails />} />
							</Route>
							<Route
								path='logged/:user/personalData'
								element={
									isAuthorized ? (
										<LayoutWithCart>
											<PersonalData />
										</LayoutWithCart>
									) : (
										<Navigate replace to='/login' />
									)
								}
							/>

							<Route path='Login' element={<Login />} />
							<Route path='Register' element={<Register />} />
						</Route>
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
