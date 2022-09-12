/** @format */

import React from 'react';
import CartLayout from './CartLayout';

const LayoutWithCart = ({ children }) => {
	return (
		<>
			{children}
			<CartLayout />
		</>
	);
};

export default LayoutWithCart;
