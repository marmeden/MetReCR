// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Tasks from './tasks.js';

if (Meteor.isServer) {

  Meteor.publish('tasks', function() {
    return Tasks.find({});
  });
}
