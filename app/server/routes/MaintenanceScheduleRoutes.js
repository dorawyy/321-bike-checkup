const express = require('express');
const MaintenanceScheduleService = require('../services/MaintenanceScheduleService');
const deviceTokenRepo = require('../repositories/DeviceTokenRepository');


const initMaintenanceSchedlueRouting = (app) => {

	const maintenanceScheduleRouter = express.Router();

	app.use('/maintenanceSchedule', maintenanceScheduleRouter);

	maintenanceScheduleRouter.get('/prediction', (req, res, next) => {
		
		var dates = {};
		deviceTokenRepo.GetAll().then(function(devices){
			dates = MaintenanceScheduleService.MaintenancePredict(devices);
		});
		
		res.send(JSON.stringify({dates: dates}));
	});

}

module.exports = initMaintenanceSchedlueRouting;