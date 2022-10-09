/** @format */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderNotyficationSchema = new Schema(
	{
		buyer: { type: String, required: true },
		date: { type: Date, required: true },
		marked: { type: Boolean, required: true },
		categories: [{ type: String, required: true }],
		products: [
			{
				count: { type: Number, required: true },
				_id: { type: String, required: true },
				name: { type: String, required: true },
				price: { type: Number, required: true }
			}
		],
		receiver: { type: String, required: true },
		total: { type: Number, required: true },
		type: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

const OrderNotyfication = mongoose.model(
	'OrderNotyfication',
	OrderNotyficationSchema
);

module.exports = OrderNotyfication;
