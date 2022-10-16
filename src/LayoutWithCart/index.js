/** @format */

import React from 'react';
import CartLayout from './CartLayout';
import { Outlet } from 'react-router-dom';

const LayoutWithCart = ({ children }) => {
	return <>{children}</>;
};

export default LayoutWithCart;
