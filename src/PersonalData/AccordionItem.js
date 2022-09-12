/** @format */

import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { Grid, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const AccordionItem = ({ item, indx }) => {
	const [expanded, setExpanded] = useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};
	return (
		<Accordion
			sx={{ width: 300 }}
			expanded={expanded === `panel${indx}`}
			onChange={handleChange(`panel${indx}`)}>
			<AccordionSummary
				sx={{ width: '100%' }}
				expandIcon={<ExpandMoreIcon />}
				aria-controls='panel1bh-content'
				id={`panel${indx}bh-header`}>
				<Stack sx={{ width: '100%' }} direction='row' alignItems='center'>
					<Typography sx={{ width: '15%', flexShrink: 0, fontFamily: 'Sofia' }}>
						{indx + 1}.
					</Typography>
					<Stack sx={{ width: '80%' }} direction='column'>
						<Typography
							sx={{
								color: 'text.secondary',
								fontSize: 12,
								fontFamily: 'Sofia'
							}}>
							{moment(new Date(item.date.seconds * 1000)).format(
								'MMMM Do YYYY, h:mm:ss a'
							)}
						</Typography>
						<Stack direction='row' spacing={1} alignItems='center'>
							<Typography sx={{ fontFamily: 'Sofia' }} variant='body1'>
								Cash amount:
							</Typography>
							<Typography
								sx={{ fontFamily: 'Sofia', fontWeight: 600, fontSize: 14 }}>
								{item.total}$
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</AccordionSummary>
			<AccordionDetails>
				<Grid container direction='row'>
					{item.products.map((item, indx) => {
						return (
							<Grid key={indx} item xs={6}>
								<Stack spacing={1} direction='row' alignItems='center'>
									<CircleIcon sx={{ fontSize: 7 }} />
									<Typography sx={{ fontFamily: 'Sofia' }} variant='body2'>
										{item.name}: {item.price}$
									</Typography>
								</Stack>
							</Grid>
						);
					})}
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
};

export default AccordionItem;
