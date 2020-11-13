const express = require('express');
const MaintenanceTaskService = require('../services/MaintenanceTaskService');
const deviceTokenRepo = require('../repositories/DeviceTokenRepository');

const initMaintenanceTaskRouting = (app) => {
  const maintenanceTaskRouter = express.Router();

  app.use('/maintenanceTask', maintenanceTaskRouter);

  maintenanceTaskRouter.get('/:userId/prediction', (req, res) => {
    deviceTokenRepo.GetAll().then(function (deviceTokens) {
      var dates = MaintenanceTaskService.MaintenancePredict(
        req.params[0],
        deviceTokens,
      );
      res.send(JSON.stringify({dates: dates}));
    });
  });

  maintenanceTaskRouter.get('/tasks', (req, res, next) => {
    deviceTokenRepo.GetAll().then(function (userId, numDays) {
      var dates = MaintenanceTaskService.GetScheduledTasksSorted(
        userId,
        numDays,
      );
      res.send(JSON.stringify({dates: dates}));
    });
  });
};

module.exports = initMaintenanceTaskRouting;
