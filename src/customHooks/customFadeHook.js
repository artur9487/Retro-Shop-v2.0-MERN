/** @format */

import { useState } from 'react';

const useCustomFadeHook = () => {
	const [fadeIn, setFadeIn] = useState('noFade');
	const setFade = () => {
		setFadeIn('noFade');
		setTimeout(
			() => {
				setFadeIn('fadeIn');
			},
			500,
			true
		);
	};

	return { fadeIn, setFade };
};

export default useCustomFadeHook;
