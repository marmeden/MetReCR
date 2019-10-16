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
import Tasks from './tasks.js';

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

export const allMyTasks = () => {
  return Tasks.find().fetch()
};

export const todaysTasks = () => {
  let today = moment(new Date).startOf('day');
  let tomorrow = moment(new Date()).add(1,'days').startOf('day');

  return Tasks.find({fecha: {$gte: new Date(today), $lte: new Date(tomorrow)}}, {sort: {fecha: 1}}).fetch()
}

export const monthTasks = () => {
  let monthIni = moment(new Date()).startOf('month');
  let monthEnd = moment(new Date()).endOf('month');
  return Tasks.find({fecha: {$gte: new Date(monthIni), $lt: new Date(monthEnd)}}, {sort: {fecha: 1}}).fetch();
}

export const quarterTasks = () => {
  let qIni = moment(new Date()).startOf('quarter');
  let qEnd = moment(new Date()).endOf('quarter');
  return Tasks.find({fecha: {$gte: new Date(qIni), $lt: new Date(qEnd)}}, {sort: {fecha: 1}}).fetch();
}

export const yearTasks = () => {
  let yIni = moment(new Date()).startOf('year');
  let yEnd = moment(new Date()).endOf('year');
  return Tasks.find({fecha: {$gte: new Date(yIni), $lt: new Date(yEnd)}}, {sort: {fecha: 1}}).fetch();
}

export const todaysExpenses = () => {
  let todayTasks = todaysTasks();
  let expenses = 0;
  todayTasks.forEach((task) => {
    expenses = expenses + parseFloat(task.precio)
  })
  return Math.round((expenses * 100) / 100)
}

export const monthExpenses = () => {
  let month = monthTasks();
  let monthEx = 0;
  month.forEach((task) => {
    monthEx = monthEx + parseFloat(task.precio)
  })
  return Math.round((monthEx * 100) / 100)
}

export const quarterExpenses = () => {
  let quarter = quarterTasks();
  let quarterEx = 0;
  quarter.forEach((task) => {
    quarterEx = quarterEx + parseFloat(task.precio)
  })
  return Math.round((quarterEx * 100) / 100)
}

export const yearExpenses = () => {
  let year = yearTasks();
  let yearEx = 0;
  year.forEach((task) => {
    yearEx = yearEx + parseFloat(task.precio)
  })
  return Math.round((yearEx * 100) / 100)
}

export const upcomingTasks = () => {
  return Tasks.find({fecha: {$gte: new Date()}}, {sort: {fecha: 1}}).fetch()
}

export const nextTask = () => {
  return Tasks.findOne({fecha: {$gte: new Date()}}, {sort: {fecha: 1}})
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