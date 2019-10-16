/* eslint-disable no-undef, no-underscore-dangle */
// Tests for the behavior of the collection
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Workers from './workers';

if (Meteor.isServer) {
  describe('workers collection', function() {
    it('inserts correctly', function() {
      const bookingId = Workers.insert({
        _id: this.userId,
        text: "",
      });
      const added = Workers.find({ _id: counterId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'workers');
      assert.equal(count, 1);
    });
  });
}