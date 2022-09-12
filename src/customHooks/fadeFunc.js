/** @format */

import { useEffect, useState } from 'react';

const fadeFunc = () => {
	let fadeIn = 'noFade';
	setTimeout(
		() => {
			fadeIn = 'fadeIn';
		},
		500,
		true
	);

	return fadeIn;
};

export default fadeFunc;
