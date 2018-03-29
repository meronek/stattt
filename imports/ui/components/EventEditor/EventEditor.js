/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class EventEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ispublic: true };
    // console.log('this.state.ispublic', this.state.ispublic);
    this.handleChange = this.handleChange.bind(this);
  }
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
          required: 'Give your Event a title.',
        },
      },
      submitHandler() { component.handleSubmit(component.form); },
    });
  }

  handleChange(event) {
    console.log('event target is', event.target.value, 'and its', event.target.value === 'true');
    this.setState({ ispublic: event.target.value === 'true' });
    console.log('state is now', this.state.ispublic);
  }

  handleSubmit(form) {
    const { history } = this.props;
    const existingEvent = this.props.event && this.props.event._id;
    const methodToCall = existingEvent ? 'event.update' : 'event.insert';
    console.log('public is type: ', this.state.ispublic, ' and it is ', this.state.ispublic === 'true');

    const event = {
      title: form.title.value.trim(),
      occurrenceType: form.occurrenceType.value.trim(),
      ispublic: this.state.ispublic,
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
          <br /><br />
          <ControlLabel>Visibility: </ControlLabel>
          {console.log('ispublic is ', event.ispublic && event.ispublic.toString())}
          <select value={this.state.ispublic} onChange={this.handleChange} className="form-control">
            <option value="true">Public: others can see your Stattt results.</option>
            <option value="false">Private: only you can see your Stattt results.</option>
          </select>
          <br /><br />
          <ControlLabel>What Type of Occurrence Are You Logging?</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="occurrenceType"
            defaultValue={event && event.occurrenceType}
            placeholder="Example: a person at this event."
          />

          <p>An <i>occurrence</i> is usually person you are logging things about. But, it can also be something else like cars going by, dogs, skateboards, etc.</p>
          <br />

        </FormGroup>
        <Button type="submit" bsStyle="success">
          {event && event._id ? 'Save Changes' : 'Add Event'}
        </Button>
      </form>
    );
  }
}

EventEditor.defaultProps = {
  event: { title: '', public: true, occurrenceType: '' },
};

EventEditor.propTypes = {
  event: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default EventEditor;
