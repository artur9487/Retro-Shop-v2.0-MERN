/** @format */

import React, { useContext } from 'react';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import './index.scss';
import { MainContext } from '../Context';

const Footer = () => {
	const { maxWidth600 } = useContext(MainContext);

	const data = [
		{
			dat: [
				'Faq',
				'Shipping & Returns',
				'Store Policy',
				'Payment Methods',
				'Stockists'
			]
		},
		{ dat: ['Facebook', 'Instagram', 'Twitter', 'Pinterest'] }
	];
	const data2 = [
		'info@my-domain.com',
		'500 Terry Francois Street ',
		'San Francisco, CA 94158 ',
		'Tel: 123-456-7890 '
	];
	return (
		<footer>
			<Box
				sx={{
					width: '100%',
					minHeight: 200,
					maxHeight: 700,
					bgcolor: 'rgb(246, 246, 246)',
					py: 5,
					mt: 10
				}}>
				<Grid
					rowSpacing={!maxWidth600 ? 5 : 3}
					direction={maxWidth600 ? 'column' : 'row'}
					container
					spacing={!maxWidth600 ? 2 : 1}>
					<Grid
						direction='column'
						alignItems='center'
						justifyContent='center'
						item
						container
						md={3}>
						<Typography
							sx={{ fontFamily: 'Oleo Script Swash Caps' }}
							variant={!maxWidth600 ? 'h4' : 'h5'}>
							RetroShop
						</Typography>
					</Grid>
					<Grid
						md={6}
						container
						item
						spacing={!maxWidth600 ? 4 : 0}
						direction='row'>
						{data.map((item1, indx) => {
							return (
								<Grid
									justifyContent='center'
									alignItems='center'
									key={indx}
									xs={6}
									container
									item
									spacing={!maxWidth600 ? 2 : 1}
									direction='column'>
									{item1.dat.map((item2, indx) => {
										return (
											<Grid key={indx} item>
												<Button
													color='inherit'
													sx={{ textTransform: 'none' }}
													variant='text'
													href='#'
													disableFocusRipple={true}
													disableRipple={true}
													onClick={() =>
														console.log(`You clicked me!${item2}`)
													}>
													<Typography
														sx={{
															fontFamily: 'Sofia',
															fontSize: !maxWidth600 ? 20 : 15
														}}
														color='black'
														variant='subtitle1'>
														{item2}
													</Typography>
												</Button>
											</Grid>
										);
									})}
								</Grid>
							);
						})}
					</Grid>
					<Grid
						item
						justifyContent='center'
						alignItems='center'
						container
						md={3}
						spacing={2}
						rowSpacing={2}
						columnSpacing={4}
						direction='column'>
						<Grid item xs={3}>
							<Typography
								sx={{ fontFamily: 'Sofia', fontWeight: 1000 }}
								variant={maxWidth600 ? 'h5' : 'h6'}
								component='div'>
								Need help?
							</Typography>
							<Typography
								sx={{ fontFamily: 'Sofia', fontWeight: 1000 }}
								variant={maxWidth600 ? 'h5' : 'h6'}
								component='div'>
								Contact Us
							</Typography>
						</Grid>
						<Grid
							justifyContent='center'
							alignItems='center'
							item
							container
							direction='column'
							xs={3}>
							{data2.map((item, indx) => {
								return (
									<Grid key={indx} item xs>
										<Typography
											sx={{ fontFamily: 'Sofia' }}
											variant='subtitle1'>
											{item}
										</Typography>
									</Grid>
								);
							})}
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</footer>
	);
};

export default Footer;
