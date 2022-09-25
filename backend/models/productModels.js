/** @format */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
	{
		category: { type: String, required: true },
		date: { type: Date, required: true },
		email: { type: String, required: true },
		image: { type: String, required: false },
		productName: { type: String, required: true },
		productPrice: { type: Number, required: true },
		productQuantity: { type: Number, required: true },
		ratingCount: { type: Number, required: true },
		ratingValue: { type: Number, required: true }
	},
	{
		timestamps: true
	}
);

const Products = mongoose.model('Products', ProductSchema);

module.exports = Products;
