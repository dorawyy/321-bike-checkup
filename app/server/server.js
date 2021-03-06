const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const axios = require('axios');
const initMaintenanceTaskRoutes = require('./routes/MaintenanceTaskRoutes');
const initUserRoutes = require('./routes/UserRoutes');
const initStravaRoutes = require('./routes/StravaRoutes');
const initMaintenanceRecordRoutes = require('./routes/MaintenanceRecordRoutes');
const initBikeRoutes = require('./routes/BikeRoutes');
const initComponentRoutes = require('./routes/ComponentRoutes');
const initActivityRoutes = require('./routes/ActivityRoutes');

const url = 'mongodb://localhost:27017/bikeCheckupDb';
const app = express();
const port = 5000;

app.use(express.json());
app.use((req, res, err, next) => {
  if (err instanceof SyntaxError && 'body' in err && err.status === 400) {
    console.error(err);
    return res.status(400).send('Error: Incorrect body syntax');
  }
  next();
});

app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});

// Run job scheduler
const autoReminderService = require('./services/AutoReminderService');

app.post('/runReminderJob', function (req, res) {
  autoReminderService
    .RunJob()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send('Job failed: ', err);
    });
});

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
// Check connection
db.once('open', function () {
  console.log('Connected to MongoDB - bikeCheckupDb');
});
// Check DB errors, print if any
db.on('error', function (err) {
  console.log('Database error: ', err);
});

app.get('/stravaActivities', async function (req, res) {
  var token = '07dad63ccaf2f16c846ca5a30c6128e27cd82338';
  axios
    .get('https://www.strava.com/api/v3/athlete/activities', {
      headers: {Authorization: 'Bearer '.concat(token)},
    })
    .then((resp) => {
      res.send(resp.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

initUserRoutes(app);
initStravaRoutes(app);
initMaintenanceTaskRoutes(app);
initMaintenanceRecordRoutes(app);
initBikeRoutes(app);
initComponentRoutes(app);
initActivityRoutes(app);

app.get('/stravaRedirect', function (req, res, next) {
  console.log('Strava auth hit');
  res.status(200).send();
});

let createTestData = async function (userId) {
  const userRepository = require('./repositories/UserRepository');

  let record = {
    description: 'Oil chain',
    maintenance_date: new Date(),
  };

  let record2 = {
    description: 'Replace chain',
    maintenance_date: new Date(),
  };

  let component1 = {
    label: 'KMC X11EL-1 Chain',
    attatchment_date: new Date(),
    removal_date: new Date(),
    maintenance_records: [record, record2],
    predicted_maintenance_date: new Date(),
  };

  let record3 = {
    description: 'Bleed brakes',
    maintenance_date: new Date(),
  };

  let component2 = {
    label: 'Shimano 105 Hydraulic Disc, 160mm',
    attatchment_date: new Date(),
    removal_date: new Date(),
    maintenance_records: [record3],
    predicted_maintenance_date: new Date(),
  };

  let bike1 = {
    _id: 'b8294806',
    owner: userId,
    label: "Rachel's Hybrid Bike",
    components: [component1],
    __v: 0,
  };
  let bike2 = {
    _id: 'b8294804',
    owner: userId,
    label: "Rachel's Road Bike",
    components: [component2],
    __v: 0,
  };

  let user = {
    _id: userId,
    name: 'Rachel Smith',
    strava_token: '348672a87ebc0e4444b4a81961b32fdd75a761fc',
    refresh_token: '2868f45d72e20be5fa737eb69ba1dc618dcbb495',
    expires_in: 17932,
    bikes: [bike1, bike2],
    deviceTokens: [],
    __v: 0,
  };

  userRepository.Create(user);
};

const userId = 123;
