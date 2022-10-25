/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

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

app.use('/api', require(path.join(__dirname, 'api', 'endpoinst.js')));

///if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(__dirname, '../frontend', 'build')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));
});
//}

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
