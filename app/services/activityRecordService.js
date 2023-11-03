const ActivityRecord = require('../models/activityRecordModel.js');
const dynamoose = require('dynamoose');

createActivityRecord = async (param) => {
	try {
		param.startTime = parseTime(param.startTime);
		param.endTime = parseTime(param.endTime);
		const activityRecord = await ActivityRecord.create(param);
		return true;
    } catch (err) {
		var msg = err.message || "Some error occurred while creating the ActivityRecord.";
        console.log("[createActivityRecord]" + msg);
        return false;
    };
}

updateActivityRecord = async (id,param) => {
	try {
		var exists = await ActivityRecord.get(id);
		if (!exists) {
			console.log("[updateActivityRecord] activityRecord not found with id: " + id);
			return false;
		}
		param.startTime = parseTime(param.startTime);
		param.endTime = parseTime(param.endTime);
		await ActivityRecord.update({"id": id}, param);
		return true;
    } catch (err) {
		var msg = err.message || "Some error occurred while updating the ActivityRecord.";
        console.log("[updateActivityRecord]" + msg);
        return false;
    };
}

deleteActivityRecord = async (id) => {
	try {
		await ActivityRecord.delete(id);
		return true;
    }
    catch(err) {
		console.log("[deleteActivityRecord]" + err.message);
		return false;
    };
}

getActivityRecords = async (token, startTime,endTime) => {
	var params = (token == null) ? {} : {"userId":{"eq": token},"startTime": {"ge": startTime}};
	var params = {};
	if (token != null) {params.userId = {"eq": token}; }
	if (startTime != null) {
		params.startTime = {"ge": parseTime(startTime)};
	}
	if (endTime != null) {
		params.endTime = {"le": parseTime(endTime)};
	}
	return await ActivityRecord.scan(params).exec().then((activityRecords) => {
		return activityRecords;
	})
	.catch((err) => {
		console.log("[getActivityRecords]" + err.message);
		return [];
	});
}

replaceActivityRecordToken = async (oldToken, newToken) => {
	return await ActivityRecord.scan({"userId": {"eq": oldToken}}).exec().then((activityRecords) => {
		if (activityRecords.length) {
			activityRecords.forEach(activityRecord => {
				ActivityRecord.update({"id": activityRecord.id}, {"userId": newToken});
			});
		}
		return true;
	}).catch((err) => {
		console.log("[replaceActivityRecordToken] " + err.message);
		return false;
	});
}

parseTime = (time) => {
	time = new Date(time);
	return time.getTime();
}

module.exports = {
    createActivityRecord,
    updateActivityRecord,
    deleteActivityRecord,
    getActivityRecords,
	replaceActivityRecordToken
}