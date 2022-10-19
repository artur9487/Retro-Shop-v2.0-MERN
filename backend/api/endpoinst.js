/** @format */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
	postYourProduct,
	getStartPage,
	getMainPage,
	deleteProduct,
	getProducts,
	postOrder,
	deleteProductsAfterOrdering,
	updateProductsAfterOrdering,
	getPersonalData,
	postComment,
	getComments,
	markNotyfications,
	register,
	login,
	updateyourProduct,
	postNewProductImage
} = require('./mainRoute');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

router.post(
	'/logged/:user/yourProduct/newProduct',
	upload,
	postNewProductImage
);
router.post(
	'/logged/:user/yourProduct/updateProduct',
	upload,
	postNewProductImage
);
router.post('/logged/:user/yourProduct', postYourProduct);
router.get('/', getStartPage);
router.get('/:productID', getComments);
router.get('/logged/:user', getMainPage);
router.delete('/logged/:user/yourProduct', deleteProduct);
router.get('/logged/:user/yourProduct', getProducts);
router.post('/logged/:user/order', postOrder);
router.delete('/logged/:user/order', deleteProductsAfterOrdering);
router.put('/logged/:user/yourProduct', updateyourProduct);
router.put('/logged/:user/order', updateProductsAfterOrdering);
router.get('/logged/:user/personalData', getPersonalData);
router.post('/logged/:user/:productID', postComment);
router.get('/logged/:user/:productID', getComments);
router.put('/logged/:user/notyfications', markNotyfications);
router.put('/logged/:user/yourProduct/notyfications', markNotyfications);
router.put('/logged/:user/personalData/notyfications', markNotyfications);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
