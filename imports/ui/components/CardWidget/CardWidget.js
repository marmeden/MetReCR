import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import './CardWidget.scss';

const CardWidget = function({title, number}) {
  return (
    <p>{title}: {number}</p>
  );
}

export default CardWidget;
