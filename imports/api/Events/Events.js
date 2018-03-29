/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Events = new Mongo.Collection('Events');

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

SimpleSchema.extendOptions(['unique']);

Events.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this event belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this event was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  ispublic: {
    type: Boolean,
    label: 'Is this event publicly viewable?',
    autoValue() {
      if (this.isInsert) return (true);
    },
  },
  title: {
    type: String,
    label: 'The title of the event.',
  },
  occurrenceType: {
    type: String,
    label: 'The type of occurrence you\'re logging at this event.',
  },
  occurrenceOptions: {
    type: Array,
    defaultValue: [],
    label: 'The list of options you have for occurrences of this event.',
    optional: true,
  },
  'occurrenceOptions.$': {
    type: Object,
    label: 'The list of options you have for occurrences of this event.',
  },
  'occurrenceOptions.$.title': {
    type: String,
    label: 'The title of the occurrence.',
    unique: true,
  },
  'occurrenceOptions.$.active': {
    type: Boolean,
    label: 'Is this option active?',
    defaultValue: true,
  },
});

Events.attachSchema(Events.schema);

export default Events;
