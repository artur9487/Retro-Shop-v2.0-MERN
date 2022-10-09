/** @format */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentNotyficationSchema = new Schema(
	{
		comment: { type: String, required: true },
		date: { type: Date, required: true },
		marked: { type: Boolean, required: true },
		productID: { type: String, required: true },
		receiver: { type: String, required: true },
		sender: { type: String, required: true },
		type: { type: String, required: true },
		value: { type: Number, required: true }
	},
	{
		timestamps: true
	}
);

const CommentNotyfication = mongoose.model(
	'CommentNotyfication',
	CommentNotyficationSchema
);

module.exports = CommentNotyfication;
