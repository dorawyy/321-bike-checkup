const {Mongoose} = require('mongoose');
const Repository = require('./Repository');

class ActivityRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['afterDateForUser'] = 0;
  }

  GetActivitiesForBikeAfterDate(bikeId, date) {
    this.count['afterDateForUser']++;
    return new Promise((resolve, reject) => {
      if (this.count['afterDateForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        switch (bikeId) {
          case 1:
            resolve([activity1, activity2, activity3]);
            break;
          case 2:
            resolve([activity4, activity5]);
            break;
          case 6:
            resolve([activity6, activity7]);
            break;
          default:
            resolve([]);
        }
      }
    });
  }

  GetActivitiesAfterDateForUser(userId, date, numberOfDays) {
    this.count['afterDateForUser']++;
    return new Promise((resolve, reject) => {
      if (userId === 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['afterDateForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        resolve(this.data);
      }
    });
  }

  GetActivitiesByIdsAfterDate(activityIds, date) {
    this.count['afterDateForUser']++;
    return new Promise((resolve, reject) => {
      if (this.count['afterDateForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        let returnData = [];
        if (activityIds.length === 0) {
          resolve([]);
        }
        //date check not necessary, all activities after maint date
        for (let index = 0; index < activityIds.length; index++) {
          let activityId = activityIds[index];
          returnData.push(this.data[activityId - 1]);
        }
        resolve(returnData);
        //resolve(data);
      }
    });
  }
}

const activity1 = {
  _id: 1,
  bike_id: 1,
  athelete_id: 1,
  description: 'test',
  distance: 30,
  time_s: 360,
  date: new Date('2020-11-21'),
};

const activity2 = {
  _id: 2,
  bike_id: 1,
  athelete_id: 1,
  description: 'test2',
  distance: 30,
  time_s: 300,
  date: new Date('2020-11-22'),
};

const activity3 = {
  _id: 3,
  bike_id: 1,
  athelete_id: 1,
  description: 'test3',
  distance: 30,
  time_s: 320,
  date: new Date('2020-11-22'),
};

const activity4 = {
  _id: 4,
  bike_id: 2,
  athlete_id: 1,
  description: 'test4',
  distance: 30,
  time_s: 400,
  date: new Date('2020-11-25'),
};

const activity5 = {
  _id: 5,
  bike_id: 2,
  athlete_id: 1,
  description: 'test5',
  distance: 35,
  time_s: 350,
  date: new Date('2020-11-26'),
};

//activities to overshoot predictions
const MILLISECONDS_IN_DAY = 86400000;
let today = new Date();
let day1 = new Date(today - 29 * MILLISECONDS_IN_DAY);
let day2 = new Date(today - 25 * MILLISECONDS_IN_DAY);

const activity6 = {
  _id: 6,
  bike_id: 6,
  athlete_id: 3,
  description: 'test6',
  distance: 250,
  time_s: 12000,
  date: day1, //new Date('2020-11-03'),
};

const activity7 = {
  _id: 7,
  bike_id: 6,
  athlete_id: 3,
  description: 'test7',
  distance: 30,
  time_s: 12000,
  date: day2, //new Date('2020-11-05'),
};

var data = [activity1, activity2, activity3, activity4, activity5];

var activityRepo = new ActivityRepository(data);

module.exports = activityRepo;
