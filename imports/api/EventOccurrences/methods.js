import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import EventsOccurrences from './EventsOccurrences';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'eventOccurrence.insert': function eventOccurrenceInsert(occurrence) {
    check(occurrence, {
	  eventId: String,
	  occurrenceItems: Array,
    });

    try {
      return EventsOccurrences.insert({ owner: this.userId, ...occurrence });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'eventOccurrence.update': function eventOccurrenceUpdate(occurrence) {
    check(occurrence, {
      _id: String,
	  eventId: String,
	  occurrenceItems: Array,
    });

    try {
      return EventsOccurrences.update({ owner: this.userId, ...occurrence });
	  } catch (exception) {
      handleMethodException(exception);
	  }
  },
  'eventOccurrence.remove': function eventOccurrenceRemove(occurrence) {
    check(occurrence, { _id: String });

    try {
      return EventsOccurrences.remove(occurrence);
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
