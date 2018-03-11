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
  title: {
    type: String,
    label: 'The title of the event.',
  },
});

Events.attachSchema(Events.schema);

export default Events;
