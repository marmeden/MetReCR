/* eslint-disable no-undef, no-underscore-dangle */
// Tests for the behavior of the collection
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Fleet from './fleet';

if (Meteor.isServer) {
  describe('fleet collection', function() {
    it('inserts correctly', function() {
      const bookingId = Fleet.insert({
        _id: this.userId,
        text: "",
      });
      const added = Fleet.find({ _id: counterId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'fleet');
      assert.equal(count, 1);
    });
  });
}