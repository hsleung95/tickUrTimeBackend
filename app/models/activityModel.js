const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');

const Activity = new dynamoose.Schema(
	{
		"id": {
			"type": String,
			"hashKey": true,
			"default": () => uuidv4()
		},
		"userId": String,
		"name": String,
		"interval": Number,
		"commonlyUsed": Boolean
	},
	{ timestamps: true }
);

module.exports = dynamoose.model('activity', Activity);