const ActivityRecord = require('../models/activityRecordModel.js');
const Token = require('../models/tokenModel.js');

getToken = (req, res) => {
	token = new Token();
	token.token = "guest|" + token._id;
	token.lastLogin = new Date();
	token.save();
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
	
	token = new Token({
		token: req.body.newToken
	});
	token.save();

	await ActivityRecord.find({"userId": req.body.oldToken}, (err, activityRecords) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (activityRecords.length) {
			activityRecords.forEach(activityRecord => {
				activityRecord.userId = req.body.newToken;
				activityRecord.save();
			});
        }
		return res.status(200).json({success: true});
    })
	.clone()
	.catch(err => console.log(err))
}


verifyToken = (req, res, next) => {
  const param = req.body.token || req.headers.token;

  if (!param) {
    return res.status(403).send("invalid token");
  }
  
  tokenModel = Token.find({"token": param}, (err, token) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
		if (!token.length) {
            return res.status(400).json({ success: false, error: "invalid token" })
		} else {
			token[0].lastLogin = new Date();
			token[0].save();
		}
		return next();
  });
};

module.exports = {
    getToken,
	updateToken,
	verifyToken
}