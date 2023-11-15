const ActivityRecord = require('../models/activityRecordModel.js');
const dynamoose = require('dynamoose');

createActivityRecord = async (param) => {
	try {
		param.startTime = parseTime(param.startTime);
		param.endTime = parseTime(param.endTime);
		await ActivityRecord.create(param);
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

getActivityRecords = async (token, activity, startTime, endTime) => {
	var params = {};
	if (token != null) {
		params.userId = {"eq": token}; 
	}
	if (startTime != null) {
		params.startTime = {"ge": parseTime(startTime)};
	}
	if (endTime != null) {
		params.endTime = {"le": parseTime(endTime)};
	}
	if (activity != null) {
		params.activity = {"contains": activity};
	}
	return await ActivityRecord.query(params).using("getActivityRecords").exec().then((activityRecords) => {
		return activityRecords;
	})
	.catch((err) => {
		console.log("[getActivityRecords]" + err);
		console.log(err);
		return [];
	});
}

getActivityRecordsByDate = async (token, activity, startTime, endTime) => {
	var records = await module.exports.getActivityRecords(token, activity, startTime, endTime);
	const result = {};
	records.forEach(record => {
		var date = parseDate(new Date(record.startTime));
		if (!result[date]) {
			result[date] = [];
		}
		result[date].push(record);
	});
	return result;
}

getActivityRecordsSummary = async (token, startTime, endTime) => {
	var records = await module.exports.getActivityRecords(token, null, startTime, endTime);
	const results = {};
	records.forEach((record) => {
		record.activity.forEach((activity) => {
			if (!results[activity]) {
				results[activity] = 0;
			}
			results[activity] += record.timeSpent;
		});
	});
	return results;
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

padZero = (val) => {
	return (val < 10) ? '0' + val : val;
}

parseDate = (date) => {
	if (date == null) return '';
	var year = date.getFullYear();
	var month = padZero(date.getMonth() + 1);
	var day = padZero(date.getDate());
	return year + '-' + month + '-' + day;
}

module.exports = {
    createActivityRecord,
    updateActivityRecord,
    deleteActivityRecord,
    getActivityRecords,
	replaceActivityRecordToken,
	getActivityRecordsByDate,
	getActivityRecordsSummary
}