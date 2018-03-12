/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const EventOccurences = new Mongo.Collection('EventOccurences');

EventOccurences.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

EventOccurences.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

/* storing owner in this schema, too, making getting the list a little simpler */
EventOccurences.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this events belongs to.',
  },
  eventId: {
    type: String,
    label: 'The ID of the event this occurence belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this occurence was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this occurence was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  occurenceItems: {
    type: Array,
    label: 'The things that are being logged for this occurence.',
  },
});

EventOccurences.attachSchema(EventOccurences.schema);

export default EventOccurences;
