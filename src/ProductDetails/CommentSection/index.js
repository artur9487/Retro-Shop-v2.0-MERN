/** @format */

import React, { useState, useContext, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { set_comment_start } from '../../redux/UI/actions';
import { Context } from '../../Context';
import { useSelector } from 'react-redux';
import { Rating, Box } from '@mui/material';
import moment from 'moment';
import styled from 'styled-components';

const CommentSection = () => {
	const {
		productID,
		product,
		user,
		pathname,
		fadeIn,
		error,
		setError,
		maxWidth600
	} = useContext(Context);
	const [comment, setComment] = useState('');
	const [value, setValue] = useState(0);
	const dispatch = useDispatch();
	const comments = useSelector((state) => state.UIData.comments);
	const pageInfo = useSelector((state) => state.productsData.pageInfo);
	const OleoFont = 'Oleo Script Swash Caps';
	const [fadeIn2, setFadeIn2] = useState('noFade');

	//----------------------ADDING NEW COMMENT WITH VALIDATION----------------
	const commentHandler = () => {
		if ((!comment && !value) || !comment || !value) {
			setError(true);
			return;
		}
		const obj = {
			comment,
			sender: user.email,
			receiver: product[0].email,
			productID,
			date: new Date(),
			value,
			type: 'comment',
			marked: false
		};
		dispatch(set_comment_start(obj, pageInfo));
		setComment('');
		setError(false);
	};

	//----------------------FADE VALIADATION MESSAGE FUNCTION----------------
	useEffect(() => {
		if (error) {
			setTimeout(
				() => {
					setFadeIn2('fadeIn');
				},
				500,
				true
			);
		} else {
			setFadeIn2('noFade');
		}
		return () => {
			setFadeIn2('noFade');
		};
	}, [error]);

	return (
		<>
			<Stack
				className={fadeIn}
				direction='column'
				sx={{ width: !maxWidth600 ? '40%' : '100%' }}>
				<div
					style={{
						overflowY: 'scroll',
						height: !comments.length <= 0 ? '400px' : '100px'
					}}>
					<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
						{comments.length === 0 ? (
							<Typography
								textAlign='center'
								variant='h5'
								sx={{ fontFamily: 'Oleo Script Swash Caps' }}>
								No comments yet
							</Typography>
						) : (
							comments.map((item, indx) => {
								return (
									<Box key={indx}>
										<ListItem
											sx={{
												display: 'flex',
												flexDirection: 'column'
											}}
											alignItems='flex-start'>
											<Stack
												direction='row'
												alignItems='flex-start'
												spacing={1}>
												<ListItemText
													primaryTypographyProps={{
														display: 'block',
														fontSize: 11,
														fontWeight: 'light',
														fontFamily: 'Sofia',
														fontStyle: 'italic'
													}}
													secondaryTypographyProps={{
														display: 'block',
														fontSize: 16,
														fontFamily: 'Sofia',
														fontStyle: 'italic'
													}}
													primary={moment(item.date.seconds * 1000).format(
														'MMMM Do YYYY h:mm a'
													)}
													secondary={item.sender}
												/>
												<Rating
													name='read-only'
													value={item.value}
													readOnly
													size='small'
												/>
											</Stack>
											<Typography
												sx={{
													color: 'black',
													fontSize: 15,
													fontWeight: 'light',
													fontFamily: 'Sofia'
												}}>
												{item.comment}
											</Typography>
										</ListItem>

										<Divider component='li' />
									</Box>
								);
							})
						)}
					</List>
				</div>
				{user && pathname !== `/yourProduct/${productID}` && (
					<Stack sx={{ mt: 3 }} spacing={2} direction='column'>
						<CustomTextField
							InputLabelProps={{
								style: {
									color: 'black',
									fontFamily: 'Sofia',
									fontStyle: 'italic',
									fontSize: 18
								}
							}}
							sx={{ color: 'black' }}
							id='outlined-multiline-static'
							label='Write your comment'
							multiline
							rows={4}
							defaultValue=''
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<Stack direction='row' justifyContent='space-evenly'>
							<Typography
								variant='body1'
								sx={{ fontFamily: 'Sofia', fontSize: 18, fontStyle: 'italic' }}>
								Set your rating:
							</Typography>
							<Rating
								name='simple-controlled'
								value={value}
								precision={1}
								onChange={(event, newValue) => {
									setValue(newValue);
								}}
							/>
						</Stack>
						{error && (
							<Typography
								textAlign='center'
								className={fadeIn2}
								sx={{ fontFamily: 'Sofia', fontSize: 18, color: 'red' }}>
								Comment not complete
							</Typography>
						)}
						<Stack direction='row' justifyContent='center'>
							<Button
								color='inherit'
								sx={{
									fontFamily: OleoFont,
									fontSize: 20,
									width: !maxWidth600 ? '50%' : '75%',
									textTransform: 'none',
									color: 'black'
								}}
								onClick={commentHandler}>
								Add Comment
							</Button>
						</Stack>
					</Stack>
				)}
			</Stack>
		</>
	);
};

export default CommentSection;

const CustomTextField = styled(TextField)`
	& .MuiOutlinedInput-root {
		&.Mui-focused fieldset {
			border-color: black;
		}
	}
`;
