const activityRecords = require("../controllers/activityRecordController.js");
var router = require("express").Router();

router.post("/", activityRecords.createActivityRecord);
router.get("/", activityRecords.getActivityRecords);
router.put("/:id", activityRecords.updateActivityRecord);
router.delete("/:id", activityRecords.deleteActivityRecord);

module.exports = router;
