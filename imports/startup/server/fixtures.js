// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import Counters from '../../api/counters/counters.js';
import Bookings from '../../api/bookings/bookings.js';
import Fleet from '../../api/fleet/fleet.js';
import Workers from '../../api/workers/workers.js';
import Tasks from '../../api/tasks/tasks.js';

Meteor.startup(() => {
  // check if db is empty, fill with fake data for testing
});
