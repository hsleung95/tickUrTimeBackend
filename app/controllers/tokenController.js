const tokenService = require("../services/tokenService");

createToken = async (req, res) => {
	var token = await tokenService.createToken(null);
	return res.json({token: token.token});
}

updateToken = async (req, res) => {
	if (!req.body || !req.body.oldToken || !req.body.newToken) {
		return res.status(400).json({sucess: false, error: "invalid param"});
	}
	var oldTokenPrefix = req.body.oldToken.substring(0,5);
	var newTokenPrefix = req.body.newToken.substring(0,5);
	if (oldTokenPrefix != "guest" || newTokenPrefix != "auth0") {
		return res.status(400).json({sucess: false, error: "invalid param"});
	}
	
	var tokenReplaced = await tokenService.replaceToken(req.body.oldToken, req.body.newToken);
	if (!tokenReplaced) {
		var msg = "Error replacing token";
		res.status(500).send({message: msg});
	}
	else {
		res.status(200).send({message: "Replace token successfully"});
	}
}


verifyToken = async (req, res, next) => {
	const param = req.body.token || req.headers.token;

	if (!param) {
	return res.status(403).send("invalid token");
	}
  
	token = await tokenService.updateTokenTimestamp(param);
	if (!token) {
		return res.status(400).json({ success: false, error: "invalid token" });
	}
	return next();
};

deleteToken = async (req, res) => {
	const id = req.params.id;
	
	await tokenService.deleteToken(id);
	return res.status(200).send("delete token successfully");
}

module.exports = {
    createToken,
	updateToken,
	verifyToken,
	deleteToken
}