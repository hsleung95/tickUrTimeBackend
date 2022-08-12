const Token = require('../models/tokenModel.js');
const activityService = require("../services/activityService");


createToken = async (newToken) => {
	token = new Token();
	if (newToken == null) {
		newToken = "guest|" + token._id;
	}
	token.token = newToken;
	token.lastLogin = new Date();
	token.save();
	activityService.initActivities(token.token);
	return token;
}

deleteToken = async (id) => {
	return Token.deleteOne({token:id})
	.clone()
    .then(data => {
      if (!data) {
		  console.log("[deleteToken] cannot delete token with id: " + id);
		  return false;
      } else {
		  return true;
	  }
    })
    .catch(err => {
		console.log("[deleteToken]" + err.message);
		return false;
    });
}

module.exports = {
	createToken,
	deleteToken
}