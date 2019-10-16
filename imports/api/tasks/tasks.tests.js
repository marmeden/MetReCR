/* eslint-disable no-undef, no-underscore-dangle */
// Tests for the behavior of the collection
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Tasks from './tasks';

if (Meteor.isServer) {
  describe('tasks collection', function() {
    it('inserts correctly', function() {
      const bookingId = Tasks.insert({
        _id: this.userId,
        text: "",
      });
      const added = Tasks.find({ _id: counterId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'tasks');
      assert.equal(count, 1);
    });
  });
}