// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Fleet from './fleet.js';

if (Meteor.isServer) {

  Meteor.publish('fleet', function() {
    return Fleet.find({});
  });
}
