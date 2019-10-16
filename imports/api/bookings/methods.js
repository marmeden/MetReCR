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

import Bookings from './bookings.js';
import { parse } from 'url';

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
 * All Bookings
 */

export const allBookings = () => {
  return Bookings.find().fetch()
};

export const todayBookings = () => {
  const today = unnaturalWeeklyBookingsSevenDays();
  return today[2];
};

export const createdTodayBookings = () => {
  let today = moment(new Date).startOf('day');
  let tomorrow = moment(new Date()).add(1,'days').startOf('day');
  return Bookings.find({createdAt: {$gte: new Date(today), $lte: new Date(tomorrow)}}, {sort: {createdAt: 1}}).fetch();
}

export const unnaturalWeeklyBookings = () => {
  let startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - 2);

  let endWeek = new Date();
  endWeek.setDate(endWeek.getDate() + 4);

  return Bookings.find({fechareco: {$gte: startWeek, $lte: endWeek}}, {sort: {fechareco: 1}}).fetch();
}

export const unnaturalWeeklyBookingsSevenDays = () => {
  let startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - 2);
  let endWeek = new Date();
  endWeek.setDate(endWeek.getDate() + 4);
  const weeklyBookings =  Bookings.find({fechareco: {$gte: startWeek, $lte: endWeek}}, {sort: {fechareco: 1}}).fetch();

  const weekTemp = [[], [], [], [], [], [], []];
  let ini = moment(startWeek);
  let fin = moment(endWeek);

  let today = new Date();
  let tomorrow = today.setDate(today.getDate() + 1)


  weeklyBookings.forEach((book) => {
    weekTemp[Math.abs(moment(book.fechareco).startOf('day').diff(ini.startOf('day'), 'days'))].push(book);
  });

  return weekTemp;
}

export const unnaturalWeeklyBookingsSevenDaysSplit = () => {
  let tempSplit = unnaturalWeeklyBookingsSevenDays();
  let weekSplit = tempSplit.map((day) => {
    let tempDay = [[], []];

    day.forEach((booking) => {
      if (crHelpers.isWithOwnCars(booking.company)) {
        tempDay[0].push(booking);
      } else {
        tempDay[1].push(booking);
      }
    });
    return tempDay;
  });

  return weekSplit
}

export const monthlyBookings = () => {
  let monthIni = moment(new Date()).startOf('month');
  let monthEnd = moment(new Date()).endOf('month');
  return Bookings.find({fechareco: {$gte: new Date(monthIni), $lt: new Date(monthEnd)}}, {sort: {fechareco: 1}}).fetch();
}

export const createdMonthBookings = () => {
  let monthIni = moment(new Date()).startOf('month');
  let monthEnd = moment(new Date()).endOf('month');
  return Bookings.find({createdAt: {$gte: new Date(monthIni), $lt: new Date(monthEnd)}}, {sort: {createdAt: 1}}).fetch();
}

export const createdQuarterBookings = () => {
  let qini = moment(new Date()).startOf('quarter');
  let qfin = moment(new Date()).endOf('quarter');

  return Bookings.find({createdAt: {$gte: new Date(qini), $lt: new Date(qfin)}}, {sort: {createdAt: 1}}).fetch();
}

export const createdYearBookings = () => {
  let yini = moment(new Date()).startOf('year');
  let yfin = moment(new Date()).endOf('year');

  return Bookings.find({createdAt: {$gte: new Date(yini), $lt: new Date(yfin)}}, {sort: {createdAt: 1}}).fetch();
}

export const upcomingBookings = () => {
  let today = moment(new Date()).startOf('day');
  return Bookings.find({fechareco: {$gte: new Date(today)}}, {sort: {fechareco: 1}}).fetch();
}

export const upcomingBookingsReal = () => {
  return Bookings.find({fechareco: {$gte: new Date()}}, {sort: {fechareco: 1}}).fetch();
}

export const pendingBookings = () => {
  return Bookings.find({$and: [{cancelada: false}, {$or: [{pagada: false}, {company: "Concretar"}, {company: "Pendiente"}]}]}).fetch();
}

export const ongoingBookings = () => {
  return Bookings.find({fechareco: {$lte: new Date()}, fechadevo: {$gte: new Date()}}, {sort: {fechareco: 1}}).fetch();
}

export const ongoingBookingsByDevo = () => {
  return Bookings.find({fechareco: {$lte: new Date()}, fechadevo: {$gte: new Date()}}, {sort: {fechadevo: 1}}).fetch();
}

export const nextBookingStart = () => {
  let upcomings = upcomingBookingsReal();
  return upcomings[0];
}

export const nextBookingEnds = () => {
  let ongoing = Bookings.find({fechareco: {$lte: new Date()}, fechadevo: {$gte: new Date()}}, {sort: {fechadevo: 1}}).fetch();
  return ongoing[0];
}


export const todayInvoiced = () => {
  let today = createdTodayBookings();
  let todayFacturado = 0;
  today.forEach((booking) => {
    todayFacturado = todayFacturado + parseFloat(booking.euroscarflet)
  })
  return Math.round((todayFacturado * 100) / 100)
}

export const monthInvoiced = () => {
  let month = createdMonthBookings();
  let monthFacturado = 0;
  month.forEach((booking) => {
    monthFacturado = monthFacturado + parseFloat(booking.euroscarflet)
  })
  return Math.round((monthFacturado * 100) / 100)
}

export const quarterInvoiced = () => {
  let quarter = createdQuarterBookings();
  let quarterFacturado = 0;
  quarter.forEach((booking) => {
    quarterFacturado = quarterFacturado + parseFloat(booking.euroscarflet)
  })
  return Math.round((quarterFacturado * 100) / 100)
}

export const yearInvoiced = () => {
  let year = createdYearBookings();
  let yearFacturado = 0;
  year.forEach((booking) => {
    yearFacturado = yearFacturado + parseFloat(booking.euroscarflet)
  })
  return Math.round((yearFacturado * 100) / 100)
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