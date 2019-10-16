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
import Fleet from './fleet.js';

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
 * All Fleet
 */

export const allMyFleet = () => {
  return Fleet.find().fetch()
};

export const fleetBusyBookings = () => {
  let ongoing = bookingsAPI.ongoingBookings();
  let own = ongoing.filter((booking) => crHelpers.isWithOwnCars(booking.company));
  return own
}

export const fleetBusyCars = () => {
  let ownBusyFleet = fleetBusyBookings().map((booking) => booking.company);
  return ownBusyFleet
}

export const fleetAvailableCars = () => {
  let all = allMyFleet();
  let busy = fleetBusyCars();
  let available = all.filter((car) => !busy.includes(car.nombreCoche));
  return available;
}

export const nextBusy = () => {
  let myupcomingBookings = bookingsAPI.upcomingBookingsReal();
  return myupcomingBookings.find((booking) => {
    return crHelpers.isWithOwnCars(booking.company);
  })
}

export const nextBusyCar = () => {
  let nextBusyBooking = nextBusy();
  if (nextBusyBooking) return nextBusyBooking.company;
}

export const nextAvailable = () => {
  let ongoings = bookingsAPI.ongoingBookingsByDevo();

  return ongoings.find((booking) => {
    return crHelpers.isWithOwnCars(booking.company);
  })
}

export const nextAvailableCar = () => {
  let nextAvailBooking = nextAvailable();
  if (nextAvailBooking) return nextAvailBooking.company;
}

export const carBookingsThisMonth = () => {
  let monthBookings = bookingsAPI.monthlyBookings();
  let monthCars = monthBookings.map(function(booking) {
    if(crHelpers.isWithOwnCars(booking.company)) {
      return booking.company;
    }
  }).filter((el) => el != null);

  var carCounter = monthCars.reduce(function(prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  let carCounterArr = Object.keys(carCounter).map(function(key) {
    return [key, carCounter[key]];
  });
  return carCounterArr;
}

export const carOfTheMonth = () => {
  let cars = carBookingsThisMonth();
  let max, maxFleet;
  if (cars.length) {
    max = cars.reduce(function(prev, current) {
      return (prev[1] > current[1]) ? prev : current
    }) 

    maxFleet = {
      "nombre": max[0],
      'numbookings': max[1]
    }
  }

 
  return maxFleet;
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