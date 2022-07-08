const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityRecord = Schema(
	{
		activity: String,
		description: String,
		startTime: Date,
		endTime: Date,
		timeSpent: Number,
		userId: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model('activityRecord', ActivityRecord);