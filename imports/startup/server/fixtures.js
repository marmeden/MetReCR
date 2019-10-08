// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import Counters from '../../api/counters/counters.js';
import Bookings from '../../api/bookings/bookings.js';

Meteor.startup(() => {
  // check if db is empty, fill with fake data for testing
});
