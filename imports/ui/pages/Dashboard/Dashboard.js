import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';

import * as crHelpers from '../../../startup/client/cr-methods.js';
import * as bookingsAPI from '../../../api/bookings/methods';
import * as fleetAPI from '../../../api/fleet/methods';
import * as workersAPI from '../../../api/workers/methods';
import * as tasksAPI from '../../../api/tasks/methods';

// collection
import Counters from '../../../api/counters/counters';
import Bookings from '../../../api/bookings/bookings';
import Fleet from '../../../api/fleet/fleet';
import Workers from '../../../api/workers/workers';
import Tasks from '../../../api/tasks/tasks';

// remote example (if using ddp)
/*
import Remote from '../../../api/remote/ddp';
import Users from '../../../api/remote/users';
*/

// components
import Modal, { Button } from '../../components/Modal/Modal';
import AddCountButton from '../../components/Button';
import Text from '../../components/Text';
import WeeklyBookings from '../../components/WeeklyBookings';
import CardWidget from '../../components/CardWidget';

import './Dashboard.scss';
import { start } from 'repl';

const SearchBar = () => (
  <form className="searchhook form-inline my-2 my-lg-0">
    <input
      className="form-control mr-sm-2"
      type="search"
      placeholder="Search"
      aria-label="Search"
    />
    <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">
      <i className="fa fa-search" />
    </button>
  </form>
);


class Dashboard extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,

    }
  }

  componentWillMount() {
    console.log("will mount");
    if (!this.props.loggedIn) {
      return this.props.history.push('/login');
    }
  }

  componentDidMount() {
    console.log("did mount");
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.loggedIn) {
      nextProps.history.push('/login');
      return false;
    }
    return true;
  }

  renderBookings () {
    //let mybookings = this.props.bookings;
    //let mybookings = this.props.today;
    let mybookings = this.props.week;

    return mybookings.map((singlebooking) => {
      return (
        <li key={singlebooking._id}>{singlebooking.nombre} <span>{singlebooking.fechareco.toString()}</span></li>
      );
    })
  }

  renderWeek () {
    if(this.props.weekSplit.length) {
      let myWeek = this.props.weekSplit;

      return (
        <div>
          <ul>
          {this.props.weekSplit.map((item, index) => 
            <li key={index}>
              <span>{item[0].length} ||| {item[1].length}</span>
            </li>
          )}
          </ul>
        </div>
      )
    } else {
      return (
        <div>Loading</div>
      )
    }
  }

  render() {
    console.log("render");
    console.log(this);
    if(!this.props.loading) {
      return (
        <div className="dashboard-page">
          <h1>This is dashboard</h1>
          <SearchBar></SearchBar>
          <p>Time Elapsed: {this.props.timeelapsed}ms.</p>
          <WeeklyBookings week={this.props.weekSplit}></WeeklyBookings>
          <CardWidget title="Bookings today" number={this.props.today.flat().length }></CardWidget>
          <CardWidget title="Bookings upcoming" number={this.props.upcoming.length }></CardWidget>
          <CardWidget title="Bookings ongoing" number={this.props.ongoing.length }></CardWidget>
          <CardWidget title="Bookings pending" number={this.props.pending.length }></CardWidget>
          <CardWidget title="Bookings month" number={this.props.monthly.length }></CardWidget>
          <p>-----------------------------</p>
          <CardWidget title="Fleet Busy" number={this.props.busy.length }></CardWidget>
          <CardWidget title="Next Free" number={this.props.nextAvailableCar}></CardWidget>
          <CardWidget title="Next Busy" number={this.props.nextBusyCar}></CardWidget>
          <CardWidget title="Car of the month" number={this.props.carOfTheMonth.nombre + " ("+this.props.carOfTheMonth.numbookings+" reservas)"}></CardWidget>
          <p>-----------------------------</p>
          <CardWidget title="Today Invoiced" number={ crHelpers.moneyFormatter(this.props.todayInvoiced) + "€"}></CardWidget>
          <CardWidget title={moment().format('MMMM') + " invoiced"} number={ crHelpers.moneyFormatter(this.props.monthInvoiced) + "€"}></CardWidget>
          <CardWidget title={moment().format('Q') + " trimestre invoiced"} number={crHelpers.moneyFormatter(this.props.quarterInvoiced) + "€"}></CardWidget>
          <CardWidget title={moment().format('YYYY') + " invoiced"} number={ crHelpers.moneyFormatter(this.props.yearInvoiced) + "€ in " + this.props.yearBookings.length+ " bookings"}></CardWidget>
          <p>-----------------------------</p>
          <CardWidget title="Today Tasks" number={this.props.todaysTasks.length}></CardWidget>
          <CardWidget title="Month Tasks" number={this.props.monthTasks.length}></CardWidget>
          <CardWidget title="Quarter Tasks" number={this.props.quarterTasks.length}></CardWidget>
          <CardWidget title="Year Tasks" number={this.props.yearTasks.length}></CardWidget>
          <p>-----------------------------</p>
          <CardWidget title="Today Expenses" number={crHelpers.moneyFormatter(this.props.todaysExp) + "€"}></CardWidget>
          <CardWidget title="Month Expenses" number={crHelpers.moneyFormatter(this.props.monthExp) + "€"}></CardWidget>
          <CardWidget title="Quarter Expenses" number={crHelpers.moneyFormatter(this.props.quarterExp) + "€"}></CardWidget>
          <CardWidget title="Year Expenses" number={crHelpers.moneyFormatter(this.props.yearExp) + "€"}></CardWidget>
          <p>-----------------------------</p>
          <CardWidget title="Workers busy today" number={this.props.workersBusyToday.length}></CardWidget>
          <CardWidget title="Workers busy month" number={this.props.workersBusyMonth.length}></CardWidget>
          <CardWidget title="Workers of the month" number={this.props.workerOfTheMonth.name + " " + this.props.workerOfTheMonth.tasks + " tasks"}></CardWidget>
          <div>
          </div>
          <ul>
            this.renderBookings()
          </ul>
        </div>
      );
    } else {
      return (
        <p>Loading..</p>
      );
    }
  }
}

export default withTracker(() => {
  // bookings here
  let bookingsub = Meteor.subscribe('bookings');
  let fleetsub = Meteor.subscribe('fleet');
  let workerssub = Meteor.subscribe('workers');
  let taskssub = Meteor.subscribe('tasks');

  const handles = [
    bookingsub, fleetsub, workerssub, taskssub
  ]



  const loading = handles.some(handle => !handle.ready());

  let monthIni = moment(new Date()).startOf('month');
  let monthEnd = moment(new Date()).endOf('month');

  let elapsed = 0;

  if(!loading) {
    if (crHelpers.firstFlag) {
      elapsed = Math.abs(moment(crHelpers.startedLoading).diff(moment(new Date()), 'milliseconds'));
      crHelpers.firstFlag = false;
    }
  } 
 


  /*const weekTempIncomes = [[], [], [], [], [], [], []];

  weeklyBookings.forEach((book) => {
    weekTempIncomes[Math.abs(moment(book.fechareco).startOf('day').diff(ini.startOf('day'), 'days'))].push(book);
  });

  let weekTempIncomesSplit = weekTempIncomes.map((day) => {
    let tempDay = [0, 0];

    day.forEach((booking) => {
      if (crHelpers.isWithOwnCars(booking.company)) {
        tempDay[0] = parseFloat(tempDay[0]) + parseFloat(booking.euroscarflet);
      } else {
        tempDay[1] = parseFloat(tempDay[1]) + parseFloat(booking.euroscarflet);
      }
    });

    return tempDay;
  });

  console.log("costes");
  console.log(weekTempIncomesSplit);

  console.log("today");
  console.log(weekTempSplit[2].flat());

  let todayFacturado = 0;
  weekTempSplit[2].flat().forEach(element => {
      todayFacturado = todayFacturado + parseInt(element.euroscarflet);
  });

  console.log("facturado hoy", todayFacturado);
  let mymonthly = Bookings.find({fechareco: {$gte: new Date(monthIni), $lt: new Date(monthEnd)}}).fetch();

  let monthlyFacturado = 0;
  mymonthly.forEach(element => {
      monthlyFacturado = monthlyFacturado + parseInt(element.euroscarflet);
  });
  console.log("facturado mes", monthlyFacturado);
  */

  console.log("test api", bookingsAPI.nextBookingStart());

  console.log("loading", loading);


  /////////////////////
  /////////////////////


  return {
    timeelapsed: elapsed,
    weekSplit: bookingsAPI.unnaturalWeeklyBookingsSevenDaysSplit(),
    today: bookingsAPI.todayBookings(),
    ongoing: bookingsAPI.ongoingBookings(),
    pending: bookingsAPI.pendingBookings(),
    monthly: bookingsAPI.monthlyBookings(),
    upcoming: bookingsAPI.upcomingBookings(),
    week: bookingsAPI.unnaturalWeeklyBookings(),
    nextBookingStart: bookingsAPI.nextBookingStart(),
    nextBookingEnd: bookingsAPI.nextBookingEnds(),

    busy: fleetAPI.fleetBusyCars(),
    nextAvailableCar: fleetAPI.nextAvailableCar(),
    nextBusyCar: fleetAPI.nextBusyCar(),
    carOfTheMonth: fleetAPI.carOfTheMonth(),

    todayInvoiced:  bookingsAPI.todayInvoiced(),
    monthInvoiced: bookingsAPI.monthInvoiced(),
    quarterInvoiced: bookingsAPI.quarterInvoiced(),
    yearInvoiced: bookingsAPI.yearInvoiced(),
    yearBookings: bookingsAPI.createdYearBookings(),

    todaysTasks: tasksAPI.todaysTasks(),
    monthTasks: tasksAPI.monthTasks(),
    quarterTasks: tasksAPI.quarterTasks(),
    yearTasks: tasksAPI.yearTasks(),

    todaysExp: tasksAPI.todaysExpenses(),
    monthExp: tasksAPI.monthExpenses(),
    quarterExp: tasksAPI.quarterExpenses(),
    yearExp: tasksAPI.yearExpenses(),

    workersBusyToday: workersAPI.workersBusyToday(),
    workersBusyMonth: workersAPI.workersBusyMonth(),
    workerOfTheMonth: workersAPI.workerOfTheMonth(),

    loading
  };
})(Dashboard);
