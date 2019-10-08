/* eslint-disable no-undef, no-underscore-dangle */
// Tests for the behavior of the collection
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Bookings from './bookings';

if (Meteor.isServer) {
  describe('bookings collection', function() {
    it('inserts correctly', function() {
      const bookingId = Bookings.insert({
        _id: this.userId,
        text: "",
      });
      const added = Bookings.find({ _id: counterId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'bookings');
      assert.equal(count, 1);
    });
  });
}