/** @format */
const jwtDecode = require('jwt-decode');
module.exports = (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		let idToken = req.headers.authorization.split('Bearer ')[1];
		const decodedToken = jwtDecode(idToken);
		if (decodedToken.exp * 1000 > Date.now()) {
			return next();
		} else {
			return res.status(403).json({ error: 'Token not valid' });
		}
	} else {
		return res.status(403).json({ error: 'Unauthorized' });
	}
};
