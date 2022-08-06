const activities = require("../controllers/activityController.js");
var router = require("express").Router();

router.post("/", activities.createActivity);
router.get("/", activities.getActivities);
router.put("/:id", activities.updateActivity);
router.delete("/:id", activities.deleteActivity);
router.get("/all",activities.getAllActivities);

module.exports = router;
