const activityRecords = require("../controllers/activityRecordController.js");
var router = require("express").Router();

router.post("/", activityRecords.createActivityRecord);
router.get("/", activityRecords.getActivityRecords);
router.put("/:id", activityRecords.updateActivityRecord);
router.delete("/:id", activityRecords.deleteActivityRecord);
router.get("/all",activityRecords.getAllActivityRecords);
router.get("/summary", activityRecords.getActivityRecordsSummary);

module.exports = router;
