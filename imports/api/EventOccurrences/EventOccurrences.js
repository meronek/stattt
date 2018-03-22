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
  title:
  {
    // this will default in the UI to the number of event occurrences plus 1
    // so, all your instances can have actual values/titles or just simply be numbered 1, 2, 3, etc
    type: String,
    label: 'The name of this occurrence instance.',
  },

  occurrenceItems: {
    type: Array,
    defaultValue: [],
    label: 'The outer array of things that are being logged for this occurrence.',
  },
  'occurrenceItems.$': {
    type: Object,
    label: 'The actual items list of occurrences for the event.',
  },
  'occurrenceItems.$.title': {
    type: String,
    label: 'The title of the occurrence.',
  },
});

EventOccurrences.attachSchema(EventOccurrences.schema);

export default EventOccurrences;
