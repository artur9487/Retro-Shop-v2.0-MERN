/** @format */

import React from 'react';
import Typography from '@mui/material/Typography';
import AccordionItem from '../AccordionItem';

const PurchasesHistory = ({ myPurchases }) => {
	return (
		<div>
			<Typography
				textAlign='center'
				variant='h5'
				sx={{ fontFamily: 'Oleo Script Swash Caps' }}>
				Last 10 Purchases:
			</Typography>
			<>
				{myPurchases.map((item, indx) => (
					<AccordionItem item={item} indx={indx} key={indx} />
				))}
			</>
		</div>
	);
};
export default PurchasesHistory;
