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
  'events.addOccurrenceOption': function eventsAddOccurrenceOption(options) {
    // make sure only the user that owns this event can insert options
    // console.log('options is ', options);
    check(options, {
      _id: String,
      title: String,
    });
    return Events.update({ eventId: options.eventId, userId: options.userId }, {
      $addToSet: {
        occurrenceOptions: { title: options.title, active: true },
      },
    });
  },
  'events.removeOccurrenceOption': function eventsRemoveOccurrenceOption(options) {
    // make sure only the user that owns this event can insert options
    // console.log('options is ', options);
    check(options, {
      _id: String,
      optionTitle: String,
    });
    // console.log('option title is ', options.optionTitle);
    return Events.update({ eventId: options.eventId, userId: options.userId }, {
      $pull: {
        occurrenceOptions: ({ title: options.optionTitle }),
      },
    });

    // trying to set active = false here and can't figure it out:
    // return Events.update({ eventId: options.eventId, userId: options.userId }, {
    //   $set: {
    //     occurrenceOptions: ({ title: options.optionTitle }, { $set: { active: false } }),
    //   },
    // });
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
