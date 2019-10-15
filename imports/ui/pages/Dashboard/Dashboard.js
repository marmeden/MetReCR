import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import * as crHelpers from '../../../startup/client/cr-methods.js';
// collection
import Counters from '../../../api/counters/counters';
import Bookings from '../../../api/bookings/bookings';
import Fleet from '../../../api/fleet/fleet';

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
  }

  componentWillMount() {
    if (!this.props.loggedIn) {
      return this.props.history.push('/login');
    }
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
    if(this.props.week.length) {
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
    return (
      <div className="dashboard-page">
        <h1>This is dashboard</h1>
        <SearchBar></SearchBar>
        <WeeklyBookings week={this.props.weekSplit}></WeeklyBookings>
        <CardWidget title="Bookings today" number={this.props.today.flat().length }></CardWidget>
        <CardWidget title="Bookings ongoing" number={this.props.ongoing.length }></CardWidget>
        <CardWidget title="Bookings pending" number={this.props.pending.length }></CardWidget>
        <CardWidget title="Bookings month" number={this.props.monthly.length }></CardWidget>
        <p>-----------------------------</p>
        <CardWidget title="Fleet Busy" number={this.props.ongoingNumber }></CardWidget>
        <CardWidget title="Next Free" number="{this.props.nextAvailable.length }"></CardWidget>
        <p>-----------------------------</p>
        <div>
        </div>
        <ul>
          {this.renderBookings()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  // bookings here
  Meteor.subscribe('bookings');
  Meteor.subscribe('fleet');

  const allBookings = Bookings.find({}).fetch();

  // Week Logic
  let startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - 2);
  let endWeek = new Date();
  endWeek.setDate(endWeek.getDate() + 4);
  const weeklyBookings =  Bookings.find({fechareco: {$gte: startWeek, $lte: endWeek}}, {sort: {fechareco: 1}}).fetch();

  const weekTemp = [[], [], [], [], [], [], []];
  let ini = moment(startWeek);
  let fin = moment(endWeek);

  let today = new Date();
  let todayIni = moment(today).startOf('day');
  let tomorrow = today.setDate(today.getDate() + 1)
  let tomorrowIni = moment(tomorrow).startOf('day');

  console.log("month");
  console.log(moment().startOf('month'));
  console.log(moment().endOf('month'));

  weeklyBookings.forEach((book) => {
    weekTemp[Math.abs(moment(book.fechareco).startOf('day').diff(ini.startOf('day'), 'days'))].push(book);
  });

  console.log(weeklyBookings);

  let weekTempSplit = weekTemp.map((day) => {
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

  let monthIni = moment(new Date()).startOf('month');
  let monthEnd = moment(new Date()).endOf('month');

  let Own = 0;
  Bookings.find({fechareco: {$lte: new Date()}, fechadevo: {$gte: new Date()}}, {sort: {fechareco: 1}}).fetch().forEach((booking) => {
    if(crHelpers.isWithOwnCars(booking.company)) Own++;
  });

  console.log("prox devols");
  console.log(Bookings.find({fechareco: {$lte: new Date()}, fechadevo: {$gte: new Date()}}, {sort: {fechadevo: 1}}).fetch());
  let nextBookingFinish = Bookings.find({fechareco: {$lte: new Date()}, fechadevo: {$gte: new Date()}}, {sort: {fechadevo: 1}}).fetch().find((booking) => {
    return crHelpers.isWithOwnCars(booking.company);
  });


  console.log(nextBookingFinish);

  let nextBookingRun = Bookings.find({fechareco: {$gte: new Date()}}, {sort: {fechareco: 1}}).fetch().find((booking) => {
    return crHelpers.isWithOwnCars(booking.company);
  });

  console.log(nextBookingRun);

  const weekTempIncomes = [[], [], [], [], [], [], []];

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

  return {
    bookings: Bookings.find().fetch(),
    pending: Bookings.find({pagada: false, company: "Concretar"}).fetch(),
    ongoing: Bookings.find({fechareco: {$lte: new Date()}, fechadevo: {$gte: new Date()}}, {sort: {fechareco: 1}}).fetch(),
    ongoingNumber: Own,
    monthly: Bookings.find({fechareco: {$gte: new Date(monthIni), $lt: new Date(monthEnd)}}).fetch(),
    today: weekTempSplit[2],
    week: weeklyBookings,
    weekSplit: weekTempSplit,
    test: "esto es una prueba",
    loaded: true,
    nextAvailable: nextBookingFinish
  };
})(Dashboard);
