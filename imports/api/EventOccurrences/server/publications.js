import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { check } from 'meteor/check';
import EventOccurrences from '../EventOccurrences';

Meteor.publish('eventoccurrences', function eventoccurrences() {
  return EventOccurrences.find({ eventId: this.eventId, owner: this.userId });
});

Meteor.publish('eventoccurrencesinstance', _id => EventOccurrences.find({ _id }));

Meteor.publish('eventoccurrences.view', function eventoccurrencesView(eventId) {
  check(eventId, String);
  return EventOccurrences.find({ eventId, owner: this.userId });
});

Meteor.publish('eventoccurrences.paged', function eventoccurrencesPaged(eventId, skip, limit) {
  check(eventId, String);
  check(skip, Number);
  check(limit, Number);
  return EventOccurrences.find(
    { eventId, owner: this.userId },
    { limit, skip, sort: { createdAt: -1 } },
  );
});

Meteor.publish('eventoccurrences.count', function (eventId) {
  check(eventId, String);
  Counts.publish(
    this, 'eventoccurrences.count',
    EventOccurrences.find({ eventId, owner: this.userId }),
  );
});
