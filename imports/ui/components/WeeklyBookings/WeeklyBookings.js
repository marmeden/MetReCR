import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import './WeeklyBookings.scss';

const WeeklyBookings = function({week}) {
  return (
    <ul>
        {week.map((day, index) => {
          return (
            <li key={index}>
              <span>{day[0].length} |||| {day[1].length} </span>
            </li>
          )
        })}
    </ul>
  );
}

export default WeeklyBookings;
