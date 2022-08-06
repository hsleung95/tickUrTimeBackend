const activityService = require("../services/activityService");
const db = require("../models");
const Activity = require('../models/activityModel.js');

createActivity = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    var activity = await activityService.createActivity(req.body);
    if (!activity) {
        res.status(400).send({message: "Error creating Activity"});
    } else {
        res.status(200).send({message: "Activity was created successfully"});
    }
}

updateActivity = async (req, res) => {
    const id = req.params.id;
	if (!id || !req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
	
	var result = await activityService.updateActivity(id, req.body);
	if (!result) {
		res.status(500).send({message: "Error updating Activity"});
	}
	else {
		res.status(200).send({message: " Activity was updated successfully"});
	}
}

deleteActivity = async (req, res) => {
    const id = req.params.id;
	
	var result = await activityService.deleteActivity(id);
	if (!result) {
		res.status(500).send({message: "Error deleting Activity"});
	}
	else {
		res.status(200).send({message: " Activity was deleted successfully"});
	}}

getActivities = async (req, res) => {
	var records = await activityService.getActivities(req.headers.token)
	.then(records => {
		res.status(200).json(records);		
	});
}

getAllActivities = async (req,res) => {
	var records = await activityService.getActivities(null)
	.then(records => {
		res.status(200).json(records);		
	});
}

module.exports = {
    createActivity,
    updateActivity,
    deleteActivity,
    getActivities,
	getAllActivities
}