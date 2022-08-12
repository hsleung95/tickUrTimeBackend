const activityRecordService = require("../services/activityRecordService");
const activityService = require("../services/activityService");
const tokenService = require("../services/tokenService");
const Token = require('../models/tokenModel.js');

createToken = async (req, res) => {
	token = await tokenService.createToken(null);
	return res.json({token: token.token});
}

updateToken = async (req, res) => {
	if (!req.body || !req.body.oldToken || !req.body.newToken) {
		return res.status(400).json({sucess: alse, error: "invalid param"});
	}
	var oldTokenPrefix = req.body.oldToken.substring(0,5);
	var newTokenPrefix = req.body.newToken.substring(0,5);
	if (oldTokenPrefix != "guest" || newTokenPrefix != "auth0") {
		return res.status(400).json({sucess: alse, error: "invalid param"});
	}
	
	var token = await tokenService.createToken(req.body.newToken);
	var activityRecordTokenReplaced = await activityRecordService.replaceActivityRecordToken(req.body.oldToken, token.token);
	var activityTokenReplaced = await activityService.replaceActivityToken(req.body.oldToken, token.token);
	if (!activityRecordTokenReplaced || !activityTokenReplaced) {
		var msg = (activityRecordTokenReplaced) ? "Error replacing activity's token" : "Error replacing activityRecord's token";
		res.status(500).send({message: msg});
	}
	else {
		res.status(200).send({message: "Replace token successfully"});
	}
}


verifyToken = (req, res, next) => {
  const param = req.body.token || req.headers.token;

  if (!param) {
    return res.status(403).send("invalid token");
  }
  
  tokenModel = Token.findOne({"token": param}, (err, token) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
		if (!token) {
            return res.status(400).json({ success: false, error: "invalid token" })
		} else {
			token.lastLogin = new Date();
			token.save();
		}
		return next();
  });
};

deleteToken = async (req, res) => {
	const id = req.params.id;
	if (!id) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
	
	activities = await activityService.getActivities(id);
	activities.forEach(activity => {
		activityService.deleteActivity(activity._id);
	});
	activityRecords = await activityRecordService.getActivityRecords(id);
	activityRecords.forEach(record => {
		activityRecordService.deleteActivityRecord(record._id);
	});
	await tokenService.deleteToken(id);
	return res.status(200).send("delete token successfully");
}

module.exports = {
    createToken,
	updateToken,
	verifyToken,
	deleteToken
}