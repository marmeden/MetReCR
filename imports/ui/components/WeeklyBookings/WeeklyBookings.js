import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import './WeeklyBookings.scss';

/*const Daily = (key, day) => [
  <li key={key}>
      {day.map((mytype) => (
        <span>{mytype.length}</span>
      ))}
  </li>,
];*/

const Daily = function(key, day) {
  console.log("day");
  console.log(day);
  return (
    <li>
      {day[0].length}
    </li>
  );
}


/*const Status = ({ loggedIn }) => (
  <div className="my-2 mr-3">
    {loggedIn ? (
      <span className="text-success">
        <i className="fa fa-circle" />
      </span>
    ) : (
      <span className="text-secondary">
        <i className="fa fa-circle" />
      </span>
    )}
  </div>
);

Status.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};*/

const WeeklyBookings = function({ week }) {
  return (
    <ul>
      {week.map((item, index) => (
        <Daily key={index} day={item} />
      ))}
    </ul>
  );
}

/*Navbar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};*/

export default WeeklyBookings;
