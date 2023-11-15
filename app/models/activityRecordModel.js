const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;
const { v4: uuidv4 } = require('uuid');

const ActivityRecord = new Schema(
	{
		"id": {
			"type": String,
			"hashKey": true,
			"default": () => uuidv4()
		},
		"activity": {
			"type": Array,
			"schema": [String]
		},
		"description": String,
		"startTime": Number,
		"endTime": Number,
		"timeSpent": Number,
		"userId": {
			"type": String,
			"index": {
				"name": "getActivityRecords"
			}
		},
		"estimatedTime": String
	},
	{
		"timestamps": true
	}
);

module.exports = dynamoose.model('activityRecord', ActivityRecord);