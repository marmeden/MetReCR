import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';

// collection
import Counters from '../../../api/counters/counters';
import Bookings from '../../../api/bookings/bookings';

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
        <div>
          {this.renderWeek()}
        </div>
        <ul>
          {this.renderBookings()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {

  let ownCars = [
       "Hyundai i20 Active Azul",
       "Opel Corsa 1.3 Amarillo",
       "Opel Corsa 1.3 Gris",
       "Opel Corsa Rojo Full-Equip",
       "Fiat 500 Negro",
       "Fiat 500 Rojo",
       "Renault Scenic",
       "WifiCar",
       "Europcar Propio",
       "Sixt Propio",
       "Avis Propio",
       "Opel Zafira Blanco",
       "Hertz Propio",
       "Peugeot 208 Gris",
       "VW Polo Europcar",
       "Peugeot 208 Gris Europcar Propio",
       "Ford Torneo",
       "Toyota automático Europcar",
       "Seat Leon Europcar",
       "Kya Rio Blanco",
       "Ford Fiesta",
       "Fiat Tipo Sedan",
       "Volkswagen Crafter",
       "Kya Rio Verde",
       "Kya Stonic Gris",
       "Fiat 500 Negro-Amarillo",
       "Hyundai i20 Active Blanco",
       "Citroen C3",
       "Dacia Sandero",
       "Citroen C-Elysee 1.6 HDI"
  ]

  function isWithOwnCars(car) {
    if (ownCars.includes(car)) {
      return true;
    } else {
      return false;
    }
  }
  // bookings here
  Meteor.subscribe('bookings');

  const allBookings = Bookings.find({}).fetch();

  // Week Logic
  let startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - 3);
  let endWeek = new Date();
  endWeek.setDate(endWeek.getDate() + 4);
  const weeklyBookings =  Bookings.find({fechareco: {$gte: startWeek, $lte: endWeek}}, {sort: {fechareco: 1}}).fetch();

  const weekTemp = [[], [], [], [], [], [], []];
  let ini = moment(startWeek);
  let fin = moment(endWeek);

  weeklyBookings.forEach((book) => {
    weekTemp[Math.abs(moment(book.fechareco).startOf('day').diff(ini.startOf('day'), 'days'))].push(book);
  });

  let weekTempSplit = weekTemp.map((day) => {
    let tempDay = [[], []];

    day.forEach((booking) => {
      if (isWithOwnCars(booking.company)) {
        tempDay[0].push(booking);
      } else {
        tempDay[1].push(booking);
      }
    });

    return tempDay;
  });


  return {
    bookings: Bookings.find().fetch(),
    today: Bookings.find({fechareco: {$gte: new Date()}}).fetch(),
    week: weeklyBookings,
    weekSplit: weekTempSplit,
    test: "esto es una prueba",
    loaded: true
  };
})(Dashboard);
