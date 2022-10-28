const { v4: uuidv4 } = require('uuid');
const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const Token = new Schema(
	{
		"token": {
			"type":String,
			"hashKey": true
		},
		"lastLogin": Date
	},
	{ timestamps: true }
);

module.exports = dynamoose.model('token', Token);