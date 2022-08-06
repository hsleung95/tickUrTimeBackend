const db = require("../models");
const Activity = require('../models/activityModel.js');

initActivities = async (userId) => {
	var initials = ["study","work","rest"];
	var res = true;
	for (i in initials) {
		var activity = {userId: userId, name: initials[i], commonlyUsed: true};
		res = module.exports.createActivity(activity) && res;		
	}
	return res;
}

createActivity = async (param) => {
    const activity = new Activity(param);
    if (!activity) {
        console.log("[createActivity] cannot create activity");
        return false;
    }

    return await activity.save()
    .then(data => {
        return true;
    })
    .catch(err => {
		var msg = err.message || "Some error occurred while creating the Activity.";
        console.log("[createActivity]" + msg);
        return false;
    });
}

updateActivity = async (id,param) => {
    return Activity.findByIdAndUpdate(id, param, { useFindAndModify: false })
	.clone()
    .then(data => {
		if (!data) {
			console.log("[updateActivity] update record failed with id: " + id);
			return false;
		}
        return true;
    })
    .catch(err => {
		console.log("[updateActivity]" + err.message);
		return false;
    });
}

deleteActivity = (id) => {
    return Activity.findByIdAndRemove(id)
	.clone()
    .then(data => {
      if (!data) {
		  console.log("[deleteActivity] cannot delete record with id: " + id);
		  return false;
      } else {
		  return true;
	  }
    })
    .catch(err => {
		console.log("[updateActivity]" + err.message);
		return false;
    });
}

getActivities = async (token) => {
	var params = (token == null) ? {} : {userId: token};
	return await Activity.find(params, (err, activities) => {
        if (err) {
			console.log("[getActivities]" + err.message);
			return [];
        }
        if (!activities.length) {
			console.log("[getActivities] no activity found"); 
            return [];
        }
        return activities;
    })
	.clone()
	.catch(err => {
		console.log("[getActivities]" + err.message);
		return [];
	});
}

replaceActivityToken = async (oldToken, newToken) => {

	return await Activity.find({"userId": oldToken}, (err, activities) => {
        if (err) {
			console.log("[replaceActivityToken] " + err.message);
			return false;
        }
        if (activities.length) {
			activities.forEach(activityRecord => {
				activityRecord.userId = newToken;
				activityRecord.save();
			});
        }
		return true;
    })
	.clone()
	.catch(err => {
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