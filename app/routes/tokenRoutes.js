const token = require("../controllers/tokenController.js");
var router = require("express").Router();

router.get("", token.getToken);
router.put("", token.updateToken);

module.exports = router;
