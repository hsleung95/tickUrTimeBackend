const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Activity = Schema(
	{
		userId: String,
		name: String,
		interval: Number,
		commonlyUsed: Boolean
	},
	{ timestamps: true }
);

module.exports = mongoose.model('activity', Activity);