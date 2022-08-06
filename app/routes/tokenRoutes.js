const token = require("../controllers/tokenController.js");
var router = require("express").Router();

router.post("", token.createToken);
router.put("", token.updateToken);

module.exports = router;
