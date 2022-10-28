const activityRecordService = require("../services/activityRecordService");
const db = require("../models");
const ActivityRecord = require('../models/activityRecordModel.js');

createActivityRecord = async (req, res) => {
    if (!req.body ||Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    var activityRecord = await activityRecordService.createActivityRecord(req.body);
    if (!activityRecord) {
        res.status(400).send({message: "Error creating ActivityRecord"});
    } else {
        res.status(200).send({message: "ActivityRecord was created successfully"});
    }
}

updateActivityRecord = async (req, res) => {
    const id = req.params.id;
	if (!id || !req.body ||Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
	
	var result = await activityRecordService.updateActivityRecord(id, req.body);
	if (!result) {
		res.status(500).send({message: "Error updating ActivityRecord"});
	}
	else {
		res.status(200).send({message: " ActivityRecord was updated successfully"});
	}
}

deleteActivityRecord = async (req, res) => {
    const id = req.params.id;
	
	var result = await activityRecordService.deleteActivityRecord(id);
	if (!result) {
		res.status(500).send({message: "Error deleting ActivityRecord"});
	}
	else {
		res.status(200).send({message: " ActivityRecord was deleted successfully"});
	}}

getActivityRecords = async (req, res) => {
	var records = await activityRecordService.getActivityRecords(req.headers.token)
	.then(records => {
		res.status(200).json(records);		
	});
}

getAllActivityRecords = async (req,res) => {
	var records = await activityRecordService.getActivityRecords(null)
	.then(records => {
		res.status(200).json(records);		
	});
}

module.exports = {
    createActivityRecord,
    updateActivityRecord,
    deleteActivityRecord,
    getActivityRecords,
	getAllActivityRecords
}