const Repository = require('./Repository');

class MaintenanceRecordRepository extends Repository {
  constructor(data) {
    super(data);
  }
}

var data = [];

var maintRecordRepo = new MaintenanceRecordRepository(data);

module.exports = maintRecordRepo;
