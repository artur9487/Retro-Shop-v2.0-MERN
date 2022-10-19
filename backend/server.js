/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const AuthRoute = require('./fbAuth.js');
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config({ path: __dirname + '/.env' });
}
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
} = require('./api/mainRoute');

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: 'sweet-corner-shop.firebaseapp.com',
	projectId: 'sweet-corner-shop',
	storageBucket: 'sweet-corner-shop.appspot.com',
	messagingSenderId: '369614338288',
	appId: process.env.APP_ID,
	measurementId: 'G-781E8EG8D9'
};

// Initialize Firebase

const fireapp = initializeApp(firebaseConfig);
const auth = getAuth(fireapp);

module.exports = { fireapp, auth };

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

app.post('/logged/:user/yourProduct/newProduct', upload, postNewProductImage);
app.post(
	'/logged/:user/yourProduct/updateProduct',
	upload,
	postNewProductImage
);
app.post('/logged/:user/yourProduct', postYourProduct);
app.get('/', getStartPage);
app.get('/:productID', getComments);
app.get('/logged/:user', getMainPage);
app.delete('/logged/:user/yourProduct', AuthRoute, deleteProduct);
app.get('/logged/:user/yourProduct', getProducts);
app.post('/logged/:user/order', postOrder);
app.delete('/logged/:user/order', deleteProductsAfterOrdering);
app.put('/logged/:user/yourProduct', updateyourProduct);
app.put('/logged/:user/order', updateProductsAfterOrdering);
app.get('/logged/:user/personalData', getPersonalData);
app.post('/logged/:user/:productID', postComment);
app.get('/logged/:user/:productID', getComments);
app.put('/logged/:user/notyfications', markNotyfications);
app.put('/logged/:user/yourProduct/notyfications', markNotyfications);
app.put('/logged/:user/personalData/notyfications', markNotyfications);
app.post('/register', register);
app.post('/login', login);
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend', 'build')));
	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));
	});
}

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
