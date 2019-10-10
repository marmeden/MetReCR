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


const Weekly = ({ week }) => (
  <div>
    Hola
    {week}
  </div>
);

class Dashboard extends React.Component {
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
    console.log("hey");
    console.log(this.props);

    return mybookings.map((singlebooking) => {
      return (
        <li key={singlebooking._id}>{singlebooking.nombre} <span>{singlebooking.fechareco.toString()}</span></li>
      );
    })
  }

  render() {
    const {
      loggedIn,
    } = this.props;

    console.log("props");
    console.log(this.props);
    
    if (!loggedIn) {
      return null;
    }
    return (
      <div className="dashboard-page">
        <h1>This is dashboard</h1>
        <SearchBar></SearchBar>
        <Weekly week={this.props.test}></Weekly>
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

  console.log("allbookings");
  console.log(Bookings.find({}).fetch());
  console.log("end");
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
  
  console.log(ini);
  console.log(fin);

  weeklyBookings.forEach((book) => {
    console.log(book.fechareco.getDate());
    console.log(moment(book.fechareco).format("YYYY"));
    console.log(Math.abs(moment(book.fechareco).startOf('day').diff(ini.startOf('day'), 'days')));
    weekTemp[Math.abs(moment(book.fechareco).startOf('day').diff(ini.startOf('day'), 'days'))].push(book);
  });

  console.log("endddd");

  console.log(weekTemp);




  return {
    bookings: Bookings.find().fetch(),
    today: Bookings.find({fechareco: {$gte: new Date()}}).fetch(),
    week: weeklyBookings,
    test: "esto es una prueba"
  };
})(Dashboard);
