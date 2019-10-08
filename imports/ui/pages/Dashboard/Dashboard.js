import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
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
    let mybookings = this.props.bookings;
    console.log("hey");
    console.log(mybookings);

    return mybookings.map((singlebooking) => {
      return (
        <li>{singlebooking}</li>
      );
    })
  }

  render() {
    const {
      loggedIn,
    } = this.props;

    // eslint-disable-line
    // remote example (if using ddp)
    /*
    console.log('usersReady', usersReady);
    console.log('users', users);
    */
    if (!loggedIn) {
      return null;
    }
    return (
      <div className="dashboard-page">
        <h1>This is dashboard</h1>
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

  console.log("asdsadafdsafds");
  console.log(Bookings.find({}).fetch());
  console.log("end");

  return {
    bookings: Bookings.find({}).fetch(),
  };
})(Dashboard);
