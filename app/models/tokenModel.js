const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Token = Schema(
	{
		token: String,
		lastLogin: Date
	},
	{ timestamps: true }
);

module.exports = mongoose.model('token', Token);