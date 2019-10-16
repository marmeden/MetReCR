// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Workers from './workers.js';

if (Meteor.isServer) {

  Meteor.publish('workers', function() {
    return Workers.find({});
  });
}
