// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const Bookings = new Mongo.Collection('bookings');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  text: {
    type: String,
  },
});

// attach schema
Bookings.attachSchema(Schema);

export default Bookings;