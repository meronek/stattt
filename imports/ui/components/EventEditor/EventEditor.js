/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class EventEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Give your Event a nice title.',
        },
      },
      submitHandler() { component.handleSubmit(component.form); },
    });
  }

  handleSubmit(form) {
    const { history } = this.props;
    const existingEvent = this.props.event && this.props.event._id;
    const methodToCall = existingEvent ? 'event.update' : 'event.insert';
    const event = {
      title: form.title.value.trim(),
    };

    if (existingEvent) event._id = existingEvent;

    Meteor.call(methodToCall, event, (error, eventId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingEvent ? 'Event updated!' : 'Event added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/events/${eventId}`);
      }
    });
  }

  render() {
    const { event } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={e => e.preventDefault()}>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="title"
            defaultValue={event && event.title}
            placeholder="Describe the Event you're tracking."
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">
          {event && event._id ? 'Save Changes' : 'Add Event'}
        </Button>
      </form>
    );
  }
}

EventEditor.defaultProps = {
  event: { title: '' },
};

EventEditor.propTypes = {
  event: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default EventEditor;
