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
    // console.log('INSERT done on the server, occurrence is', occurrence);
    try {
      return EventOccurrences.insert({ owner: this.userId, ...occurrence });
    } catch (exception) {
      handleMethodException(exception);
    }
  },

  'eventOccurrenceItem.insert': function eventOccurrenceInsertItem(options) {
    check(options, {
      _id: String,
      title: String,
    });
    return EventOccurrences.update(options._id, {
      updatedAt: (new Date()).toISOString(),
      $addToSet: {
        occurrenceItems: { title: options.title },
      },
    });
  },

  'eventOccurrenceItem.remove': function eventOccurrenceInsertItem(options) {
    check(options, {
      _id: String,
      title: String,
    });
    return EventOccurrences.update(options._id, {
      $pull: {
        occurrenceItems: { title: options.title },
      },
    });
  },
  'eventOccurrence.remove': function eventOccurrenceRemove(_id) {
    check(_id, {
      _id: String,

    });
    try {
      return EventOccurrences.remove(_id);
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
