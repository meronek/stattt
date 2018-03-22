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
    // console.log('options.eventId is ', options._id);
    return Events.update({ _id: options._id, owner: this.userId }, {
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

    // trying to set active = false here
    // https://docs.mongodb.com/manual/reference/operator/update/positional/
    // console.log(Events.find({ eventId: options.eventId, userId: options.userId }).fetch());
    // console.log('eventid here is', options._id, 'userid is ', this.userId, '. title of the thing is ', options.optionTitle);
    // console.log(Events.find({ _id: options._id, owner: this.userId }));
    return Events.update({ _id: options._id, owner: this.userId, 'occurrenceOptions.title': options.optionTitle }, {
      $set: { 'occurrenceOptions.$.active': false },
    });
  },
  'events.reactivateOccurrenceOption': function eventsReactivateOccurrenceOption(options) {
    // make sure only the user that owns this event can insert options
    // console.log('options is ', options);
    check(options, {
      _id: String,
      optionTitle: String,
    });

    // trying to set active = false here
    // https://docs.mongodb.com/manual/reference/operator/update/positional/
    // console.log(Events.find({ eventId: options.eventId, userId: options.userId }).fetch());
    // console.log('eventid here is', options._id, 'userid is ', this.userId, '. title of the thing is ', options.optionTitle);
    return Events.update({ _id: options._id, owner: this.userId, 'occurrenceOptions.title': options.optionTitle }, {
      $set: { 'occurrenceOptions.$.active': true },
    });
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
