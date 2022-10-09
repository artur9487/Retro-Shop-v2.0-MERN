/** @format */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const AuthRoute = require('./fbAuth.js');
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
	markNotyfications1,
	markNotyfications2,
	markNotyfications3,
	register,
	login,
	updateyourProduct
} = require('./routes/mainRoute');

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

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

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
app.put('/logged/:user/:productID', markNotyfications1);
app.put('/logged/:user/:productID', markNotyfications2);
app.put('/logged/:user/:productID', markNotyfications3);
app.post('/register', register);
app.post('/login', login);

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
