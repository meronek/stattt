import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import EventOccurrences from './EventOccurrences';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'eventOccurrence.insert': function eventOccurrenceInsert(occurrence) {
    check(occurrence, {
      eventId: String,
      occurrenceItems: Array,
      title: String,
    });
    // console.log('on the server, occurrence is', occurrence);
    try {
      return EventOccurrences.insert({ owner: this.userId, ...occurrence });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'eventOccurrence.update': function eventOccurrenceUpdate(occurrence) {
    console.log('occurrence on the server is', occurrence._id);
    check(occurrence, {
      _id: String,
      eventId: String,
      occurrenceItems: Array,
      title: String,
    });

    try {
      return EventOccurrences.update({ occurrence });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'eventOccurrence.remove': function eventOccurrenceRemove(occurrence) {
    check(occurrence, { _id: String });

    try {
      return EventOccurrences.remove(occurrence);
    } catch (exception) {
      handleMethodException(exception);
    }
  },

});

rateLimit({
  methods: [
    'eventOccurrence.insert',
    'eventOccurrence.update',
    'eventOccurrence.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
