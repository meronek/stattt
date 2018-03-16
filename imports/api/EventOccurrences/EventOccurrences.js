/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const EventOccurrences = new Mongo.Collection('EventOccurrences');

EventOccurrences.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

EventOccurrences.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

/* storing owner in this schema, too, making getting the list a little simpler */
EventOccurrences.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this events belongs to.',
  },
  eventId: {
    type: String,
    label: 'The ID of the event this occurrence belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this occurrence was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this occurrence was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  occurrenceItems: {
    type: Array,
    label: 'The things that are being logged for this occurrence.',
  },
});

EventOccurrences.attachSchema(EventOccurrences.schema);

export default EventOccurrences;