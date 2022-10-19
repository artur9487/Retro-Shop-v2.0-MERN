/** @format */

import styled from 'styled-components';

export const StartBar = styled.div`
	box-shadow: 5px 5px 10px grey;
	width: 250px;
	@media (max-width: 600px) {
		margin-top: 50px;
		width: 200px;
		min-height: ${(props) => props.heightSmall};
		margin-bottom: 50px;
	}
	@media (min-width: 600px) {
		min-height: ${(props) => props.heightSmall};
	}
	position: absolute;
	top: 70%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 2rem;
`;
