const Token = require('../models/tokenModel.js');
const activityRecordService = require("../services/activityRecordService");
const activityService = require("../services/activityService");
const { v4: uuidv4 } = require('uuid');

createToken = async (newToken) => {
	if (newToken == null || newToken == "") {
		newToken = "guest|" + uuidv4();
	}

	try {
		var token = await Token.get(newToken);
		if (token) {
			console.log("[createToken]token " + token + " already exists");
			return token;
		}
		token = await Token.create({"lastLogin": new Date(), "token":newToken});
		activityService.initActivities(newToken);
		return token;
    } catch (err) {
		var msg = err.message || "Some error occurred while creating the Token.";
        console.log("[createToken]" + msg);
        return null;
    };
	return token;
}

replaceToken = async (oldToken, newToken) => {
	var token = await module.exports.createToken(newToken);
	await activityRecordService.replaceActivityRecordToken(oldToken, newToken);
	await activityService.replaceActivityToken(oldToken, newToken);
	return true;

}

updateTokenTimestamp = async (tokenVal) => {
	try {
		var token = await Token.get(tokenVal);
		if (!token) {
			console.log("[updateTokenTimestamp] token not found");
			return false;
		}
		token = await Token.update({"token": tokenVal}, {"lastLogin": new Date()});
		return true;
    } catch (err) {
		var msg = err.message || "Some error occurred while updating the Token Timestamp.";
        console.log("[updateTokenTimestamp]" + msg);
        return false;
    };
}

deleteToken = async (id) => {	
	try {
		activities = await activityService.getActivities(id);
		if (activities) {
			activities.forEach(activity => {
				activityService.deleteActivity(activity.id);
			});
		}
		activityRecords = await activityRecordService.getActivityRecords(id);
		if (activityRecords) {
			activityRecords.forEach(record => {
				activityRecordService.deleteActivityRecord(record.id);
			});
		}
		var result = await Token.delete(id);
		return true;
    }
    catch(err) {
		console.log("[deleteToken]" + err.message);
		return false;
    };
}

module.exports = {
	createToken,
	replaceToken,
	updateTokenTimestamp,
	deleteToken
}