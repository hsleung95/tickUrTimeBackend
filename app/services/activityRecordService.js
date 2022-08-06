const db = require("../models");
const ActivityRecord = require('../models/activityRecordModel.js');

createActivityRecord = async (param) => {
    const activityRecord = new ActivityRecord(param);
    if (!activityRecord) {
        console.log("[createActivityRecord] cannot create record");
        return false;
    }

    return await activityRecord.save()
    .then(data => {
        return true;
    })
    .catch(err => {
		var msg = err.message || "Some error occurred while creating the ActivityRecord.";
        console.log("[createActivityRecord]" + msg);
        return false;
    });
}

updateActivityRecord = async (id,param) => {
    return ActivityRecord.findByIdAndUpdate(id, param, { useFindAndModify: false })
	.clone()
    .then(data => {
		if (!data) {
			console.log("[updateActivityRecord] update record failed with id: " + id);
			return false;
		}
        return true;
    })
    .catch(err => {
		console.log("[updateActivityRecord]" + err.message);
		return false;
    });
}

deleteActivityRecord = (id) => {
    return ActivityRecord.findByIdAndRemove(id)
	.clone()
    .then(data => {
      if (!data) {
		  console.log("[deleteActivityRecord] cannot delete record with id: " + id);
		  return false;
      } else {
		  return true;
	  }
    })
    .catch(err => {
		console.log("[updateActivityRecord]" + err.message);
		return false;
    });
}

getActivityRecords = async (token) => {
	var params = (token == null) ? {} : {userId: token};
	return await ActivityRecord.find(params, (err, activityRecords) => {
        if (err) {
			console.log("[getActivityRecords]" + err.message);
			return [];
        }
        if (!activityRecords.length) {
			console.log("[getActivityRecords] no activityRecord found"); 
            return [];
        }
        return activityRecords;
    })
	.clone()
	.catch(err => {
		console.log("[getActivityRecords]" + err.message);
		return [];
	});
}

replaceActivityRecordToken = async (oldToken, newToken) => {
	return await ActivityRecord.find({"userId": oldToken}, (err, activityRecords) => {
        if (err) {
			console.log("[replaceActivityRecordToken] " + err.message);
			return false;
        }
        if (activityRecords.length) {
			activityRecords.forEach(activityRecord => {
				activityRecord.userId = newToken;
				activityRecord.save();
			});
        }
		return true;
    })
	.clone()
	.catch(err => {
		console.log("[replaceActivityRecordToken] " + err.message);
		return false;
	});
}

module.exports = {
    createActivityRecord,
    updateActivityRecord,
    deleteActivityRecord,
    getActivityRecords,
	replaceActivityRecordToken
}