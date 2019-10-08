// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Bookings from './bookings.js';

if (Meteor.isServer) {

  Meteor.publish('bookings', function() {
    return Bookings.find({});
  });
}
