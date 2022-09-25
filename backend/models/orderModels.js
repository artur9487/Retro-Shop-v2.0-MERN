/** @format */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		categories: [{ type: String, required: true }],
		date: { type: Date, required: true },
		email: { type: String, required: true },
		products: [
			{
				count: { type: Number, required: true },
				id: { type: String, required: true },
				name: { type: String, required: true },
				price: { type: Number, required: true },
				remain: { type: Number, required: true },
				userProduct: { type: Number, required: true }
			}
		],
		total: { type: Number, required: true }
	},
	{
		timestamps: true
	}
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
