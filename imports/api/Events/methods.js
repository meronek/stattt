import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from './Events';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'event.insert': function eventsInsert(doc) {
    check(doc, {
      title: String,
    });

    try {
      return Events.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'event.update': function eventsUpdate(event) {
    check(event, {
      _id: String,
      title: String,
    });

    try {
      const eventId = event._id;
      Events.update(eventId, { $set: event });
      return eventId; // Return _id so we can redirect to document after update.
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'event.remove': function eventRemove(eventId) {
    check(eventId, String);

    try {
      return Events.remove(eventId);
    } catch (exception) {
      handleMethodException(exception);
    }
  },
});

rateLimit({
  methods: [
    'events.insert',
    'events.update',
    'events.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
