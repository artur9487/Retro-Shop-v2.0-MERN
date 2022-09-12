/** @format */

import React, { useContext } from 'react';
import UppBar from './UpBarr/UppBarr';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/system';
import styled from 'styled-components';
import './completeApp.scss';
import { MainContext } from './Context';

const CompleteApp = () => {
	const { user } = useContext(MainContext);
	return (
		<AllApp>
			<UppBar />
			<Box
				sx={{
					position: 'relative',
					minWidth: '100%',
					minHeight: '40vh',
					pt: { xs: 20, sm: user ? 25 : 20 }
				}}>
				<Outlet />
			</Box>
		</AllApp>
	);
};

const AllApp = styled.div`
	position: relative;
	width: 100%;
	height: 100vh;
`;

export default CompleteApp;
