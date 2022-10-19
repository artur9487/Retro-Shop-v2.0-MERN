/** @format */

import React, { useContext } from 'react';
import { Stack } from '@mui/material';
import { Context } from '../../Context';
import { Box, Typography } from '@mui/material';

const SideBar = () => {
	const { handleClickOpen } = useContext(Context);
	return (
		<Stack direction='column' justifyContent='center'>
			<Typography
				onClick={() => handleClickOpen('add')}
				variant='h6'
				textAlign='center'
				sx={{
					fontFamily: 'Sofia',
					p: 2,
					cursor: 'pointer',
					fontWeight: 1000,
					fontStyle: 'italic'
				}}>
				Add New Product
			</Typography>
			<Box
				sx={{
					bgcolor: 'black',
					height: 2,
					width: 200,
					borderRadius: 5
				}}
			/>
		</Stack>
	);
};
export default SideBar;
