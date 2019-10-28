/**
 * Meteor methods
 */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { MethodHooks } from 'meteor/lacosta:method-hooks';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import moment from 'moment';
import * as crHelpers from '../../startup/client/cr-methods';

import * as bookingsAPI from '../bookings/methods.js';
import * as tasksAPI from '../tasks/methods.js';
import Workers from './workers.js';

/** **************** Helpers **************** */

const mixins = [LoggedInMixin, MethodHooks, CallPromiseMixin];

// not logged in error message
const checkLoggedInError = {
  error: 'notLogged',
  message: 'You need to be logged in to call this method',
  reason: 'You need to login',
};

/** **************** Querying Methods **************** */

/**
 * All Workers
 */

export const allMyWorkers = () => {
  return Workers.find().fetch()
};

export const allMyActiveWorkers = () => {
  return Workers.find({isActive: true}).fetch()
};

export const workersBusyToday = () => {
  let todaysTasks = tasksAPI.todaysTasks();
  let tempworkers = todaysTasks.map((task) => task.worker);
  let uniq = [...new Set(tempworkers)];
  return uniq
};

export const workersBusyMonth = () => {
  let monthTasks = tasksAPI.monthTasks();
  let tempworkers = monthTasks.map((task) => task.worker);
  let uniq = [...new Set(tempworkers)];
  return uniq
}

export const workerOfTheMonth = () => {
  let monthTasks = tasksAPI.monthTasks();
  let tempworkers = monthTasks.map((task) => task.worker);
  
  var workerCounter = tempworkers.reduce(function(prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  let workerCounterArr = Object.keys(workerCounter).map(function(key) {
    return {
      "name": key, 
      "tasks": workerCounter[key]
    };
  });

  workerCounterArr.sort((a,b) => (a.tasks < b.tasks) ? 1 : ((b.tasks < a.tasks) ? -1 : 0));
  return workerCounterArr[0];
}












/**
 * countersIncrease
 */

// eslint-disable-next-line no-unused-vars, arrow-body-style
const beforeHookExample = (methodArgs, methodOptions) => {
  // console.log('countersIncrease before hook');
  // perform tasks
  return methodArgs;
};
// eslint-disable-next-line no-unused-vars, arrow-body-style
const afterHookExample = (methodArgs, returnValue, methodOptions) => {
  // console.log('countersIncrease: after hook:');
  // perform tasks
  return returnValue;
};

/*export const countersIncrease = new ValidatedMethod({
  name: 'counters.increase',
  mixins,
  beforeHooks: [beforeHookExample],
  afterHooks: [afterHookExample],
  checkLoggedInError,
  checkRoles: {
    roles: ['admin', 'user'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',
    },
  },
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: false,
    },
  }).validator(),
  run({ _id }) {
    // console.log('counters.increase', _id);
    if (Meteor.isServer) {
      // secure code - not available on the client
    }
    // call code on client and server (optimistic UI)
    return Counters.update(
      { _id },
      {
        $inc: {
          count: 1,
        },
      }
    );
  },
});
*/
/**
 * used for example test in methods.tests.js
 */
/*export const countersInsert = new ValidatedMethod({
  name: 'counters.insert',
  mixin: [CallPromiseMixin],
  validate: null,
  run() {
    const _id = Random.id();
    // console.log('counters.insert', _id);
    const counterId = Counters.insert({
      _id,
      count: Number(0),
    });
    return counterId;
  },
});
*/