import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';

import * as crHelpers from '../../../startup/client/cr-methods.js';
//import * as bookingsAPI from '../../../api/bookings/methods';
//import * as fleetAPI from '../../../api/fleet/methods';
//import * as workersAPI from '../../../api/workers/methods';
//import * as tasksAPI from '../../../api/tasks/methods';

// collection
//import Counters from '../../../api/counters/counters';
import Bookings from '../../../api/bookings/bookings';
//import Fleet from '../../../api/fleet/fleet';
//import Workers from '../../../api/workers/workers';
//import Tasks from '../../../api/tasks/tasks';

// remote example (if using ddp)
/*
import Remote from '../../../api/remote/ddp';
import Users from '../../../api/remote/users';
*/

// components
import Modal, { Button } from '../../components/Modal/Modal';
//import AddCountButton from '../../components/Button';
//import Text from '../../components/Text';
import WeeklyBookings from '../../components/WeeklyBookings';
import CardWidget from '../../components/CardWidget';

import './Bookings.scss';
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


class BookingsView extends React.Component {
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


  render() {
    console.log("render");
    console.log(this);
    if(!this.props.loading) {
      return (
        <div className="bookings-page">
          <h1>This is Bookings</h1>
          <SearchBar></SearchBar>
          <div>
          </div>
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
  //let bookingsub = Meteor.subscribe('bookings');
  //let fleetsub = Meteor.subscribe('fleet');
  //let workerssub = Meteor.subscribe('workers');
  //let taskssub = Meteor.subscribe('tasks');

  /*const handles = [
    bookingsub, fleetsub, workerssub, taskssub
  ]*/



  //const loading = handles.some(handle => !handle.ready());

  /*let monthIni = moment(new Date()).startOf('month');
  let monthEnd = moment(new Date()).endOf('month');

  let elapsed = 0;

  if(!loading) {
    if (crHelpers.firstFlag) {
      elapsed = Math.abs(moment(crHelpers.startedLoading).diff(moment(new Date()), 'milliseconds'));
      crHelpers.firstFlag = false;
    }
  } 

  */
 

  //console.log("test api", bookingsAPI.nextBookingStart());

  //console.log("loading", loading);


  /////////////////////
  /////////////////////


  return {
    //loading
  };
})(BookingsView);
