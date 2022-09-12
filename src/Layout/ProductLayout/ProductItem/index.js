/** @format */

import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import './index.scss';
import { Stack } from '@mui/material';

const ProductItem = (item) => {
	const navigate = useNavigate();
	const { productName, productPrice, id, image } = item;

	return (
		<Card className='boxek' sx={{ width: 250, height: 350, margin: 1 }}>
			<Box sx={{ position: 'relative', height: '80%' }}>
				<CardMedia
					sx={{ zIndex: 1, objectFit: 'contain' }}
					component='img'
					height='100%'
					src={image}
					alt='Missing Photo'
				/>
				<CardActions
					sx={{
						zIndex: 2,
						position: 'absolute',
						bottom: -55,
						backgroundColor: 'white',
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						height: 40,
						transition: 'all 0.5s ease-in-out'
					}}
					className='childBox'
					disableSpacing>
					<Button
						color='inherit'
						sx={{ color: 'black', bg: 'black', textTransform: 'none' }}
						onClick={() => navigate(`/${id}`)}>
						<Typography
							sx={{
								color: 'black',
								fontFamily: 'Sofia',
								fontSize: 17,
								fontStyle: 'italic'
							}}
							variant='body2'>
							View More
						</Typography>
					</Button>
				</CardActions>
			</Box>

			<CardContent
				sx={{
					backgroundColor: 'white',
					position: 'relative',
					zIndex: 3,
					height: '20%'
				}}>
				<Stack direction='column' alignItems='center'>
					<Typography
						sx={{ fontFamily: 'Oleo Script Swash Caps', fontSize: 20 }}
						variant='body1'>
						{productName}
					</Typography>
					<Typography
						sx={{ fontFamily: 'Sofia', fontSize: 15 }}
						variant='body2'>
						{productPrice}$
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default ProductItem;
