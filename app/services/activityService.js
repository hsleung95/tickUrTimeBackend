const db = require("../models");
const Activity = require('../models/activityModel.js');
const initials = ["study","work","rest"];


initActivities = async (userId) => {
	var res = true;
	for (i in initials) {
		var activity = {userId: userId, name: initials[i], commonlyUsed: true};
		res = module.exports.createActivity(activity) && res;		
	}
	return res;
}

createActivity = async (param) => {
	try {
		const activity = await Activity.create(param);
		return true;
    } catch (err) {
		var msg = err.message || "Some error occurred while creating the Activity.";
        console.log("[createActivityRecord]" + msg);
        return false;
    };
}

updateActivity = async (id,param) => {
	try {
		var exists = await Activity.get(id);
		if (!exists) {
			console.log("[updateActivity] activity not found with id: " + id);
			return false;
		}
		await Activity.update({"id": id}, param);
		return true;
    } catch (err) {
		var msg = err.message || "Some error occurred while updating the Activity.";
        console.log("[updateActivity]" + msg);
        return false;
    };
}

deleteActivity = async (id) => {
	try {
		var result = await Activity.delete(id);
		return true;
    }
    catch(err) {
		console.log("[deleteActivity]" + err.message);
		return false;
    };
}

getActivities = async (token) => {	
	var params = (token == null) ? {} : {"userId":{"eq": token}};
	const result = await Activity.scan(params).exec().then((activities) => {
		return activities;
	})
	.catch((err) => {
		console.log("[getActivities]" + err.message);
		return [];
	});
	return result;
}

replaceActivityToken = async (oldToken, newToken) => {	
	return await Activity.scan({"userId": {"eq": oldToken}}).exec().then((activities) => {
		if (activities.length) {
			activities.forEach(activity => {
				Activity.update({"id": activity.id}, {"userId": newToken});
			});
		}
		return true;
	}).catch((err) => {
		console.log("[replaceActivityToken] " + err.message);
		return false;
	});
}

module.exports = {
	initActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivities,
	replaceActivityToken
}