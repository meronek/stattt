import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { check } from 'meteor/check';
import Events from '../Events';
import EventOccurrences from '../../EventOccurrences/EventOccurrences';

Meteor.publish('events', function events() {
  return Events.find({ owner: this.userId });
});

Meteor.publish('events.paged', function eventsPaged(skip, limit) {
  // using skip and limimt commands here: https://scalegrid.io/blog/fast-paging-with-mongodb/
  check(skip, Number);
  check(limit, Number);

  // console.log('this is returning: ', Events.find({ owner: this.userId }, { limit: 3, skip: 3 }));

  return Events.find({ owner: this.userId }, { limit, skip, sort: { createdAt: -1 } });
});

Meteor.publish('events.count', function () {
  Counts.publish(this, 'events.count', Events.find({ owner: this.userId }));
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('event.view', function eventsView(eventId) {
  check(eventId, String);
  // console.log('over in publications, this shit is', EventOccurrences.find({ eventId, owner: this.userId }).fetch());
  return [
    Events.find({ _id: eventId, owner: this.userId }),
    EventOccurrences.find({ eventId, owner: this.userId }),
  ];
});

