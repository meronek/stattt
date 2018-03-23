import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from '../Events';
import EventOccurrences from '../../EventOccurrences/EventOccurrences';

Meteor.publish('events', function events() {
  return Events.find({ owner: this.userId });
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

