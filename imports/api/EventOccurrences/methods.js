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
    console.log('INSERT done on the server, occurrence is', occurrence);
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
    console.log('option is', options);
    return EventOccurrences.update(options._id, {
      $addToSet: {
        occurrenceItems: { title: options.title },
      },
    });
  },

  'eventOccurrence.update': function eventOccurrenceUpdate(occurrence) {
    // console.log('occurrence on the server is', occurrence._id);

    check(occurrence, {
      _id: String,
      eventId: String,
      occurrenceItems: Array,
      title: String,

    });
    console.log('UPDATE on the server, occurrenceid is', occurrence._id, 'occurrance items is now', occurrence.occurrenceItems);
    const thisfuckingshit = occurrence.occurrenceItems;
    try {
      console.log('this fucking shit is', Object.values(thisfuckingshit));
      // GODDAMN WHY THE FUCK ISN'T THIS SHIT SAVING
      // IT WORKS ON THE COMMAND LINE LIKE:
      // db.getCollection('EventOccurrences').update({ _id: 'XyKCbTgQnsKKSDuqo' }, { $set: { occurrenceItems:  ['Puking Hot Chick', 'Horse Poop in the Road', 'Cop' ] } })
      // BUT NOTHING HERE WORKS
      return EventOccurrences.update({ _id: occurrence._id }, { $set: { 'occurrenceItems.$': thisfuckingshit } });
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
