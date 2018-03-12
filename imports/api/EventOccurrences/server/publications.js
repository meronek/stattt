import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import EventOccurrences from '../EventOccurrences';

Meteor.publish('eventoccurrences', function eventoccurrences() {
  return EventOccurrences.find({ eventId: this.eventId, owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('eventoccurrences.view', function eventoccurrencesView(eventId) {
  check(eventId, String);
  return EventOccurrences.find({ _id: eventId, owner: this.userId });
});
