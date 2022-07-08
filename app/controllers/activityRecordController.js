const db = require("../models");
const ActivityRecord = require('../models/activityRecordModel.js');

createActivityRecord = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

	/*
    const activityRecord = new ActivityRecord({
	activity: req.body.activity,
	startTime: req.body.startTime,
	endTime: req.body.endTime,
	timeSpent: req.body.timeSpent
    });
	*/
	const activityRecord = new ActivityRecord(req.body);
	if (!activityRecord) {
		return res.status(400).json({ success: false, error: err });
	}

    activityRecord
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ActivityRecord."
      });
    });
}

updateActivityRecord = (req, res) => {
    const id = req.params.id;
    ActivityRecord.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
	.clone()
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: "Cannot update ActivityRecord with id=${id}."
        });
      } else res.send({ message: "ActivityRecord was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ActivityRecord with id=" + id
      });
    });
}

deleteActivityRecord = (req, res) => {
    const id = req.params.id;
	console.log(id);
    ActivityRecord.findByIdAndRemove(id)
	.clone()
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: "Cannot delete ActivityRecord with id=${id}."
        });
      } else res.send({ message: "ActivityRecord was deleted successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting ActivityRecord with id=" + id
      });
    });    
}

getActivityRecords = async (req, res) => {
//	await ActivityRecord.find({userId: req.params.userId}, (err, activityRecords) => {
	await ActivityRecord.find({}, (err, activityRecords) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!activityRecords.length) {
            return res
                .status(404)
                .json({ success: false, error: `ActivityRecord not found` })
        }
        return res.status(200).json({ success: true, data: activityRecords })
    })
	.clone()
	.catch(err => console.log(err))
}

module.exports = {
    createActivityRecord,
    updateActivityRecord,
    deleteActivityRecord,
    getActivityRecords
}