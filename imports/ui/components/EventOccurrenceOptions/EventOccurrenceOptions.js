/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, InputGroup, InputGroupButton } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Events from '../../../api/Events/Events';

class EventOccurrenceOptions extends React.Component {
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
          required: 'What\'s the title for this occurrence option?',
        },
      },
      submitHandler() { component.handleSubmit(component.form); },
    });
  }

  handleSubmit(form) {
    const { history } = this.props;
    const occurrence = {
      _id: this.props.eventId,
      title: form.occurrenceTitle.value.trim(),
    };
    // console.log('occurrence is', occurrence);
    Meteor.call('events.addOccurrenceOption', occurrence, (error) => {
      if (error) {
        Bert.alert(`Error: ${error.reason}`, 'danger');
      } else {
        // during testing, classic add button here, but final will be add on swipe away
        const confirmation = 'Occurrence option added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        // not sending them anywhere on save
        // history.push(`/documents/${documentId}`);
      }
    });
  }

  render() {
    const { eventsOccurrenceOptions } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <InputGroup>
            <input type="text" className="form-control" placeholder="New Occurrence Option" name="occurrenceTitle" />
            <span className="input-group-btn">
              <Button type="submit" bsStyle="success">
                Add
              </Button>
            </span>
          </InputGroup>
        </FormGroup>
        <h4>Current Options</h4>
        {console.log('eventsOccurrenceOptions as array is ', Object.keys(eventsOccurrenceOptions.occurrenceOptions).map(i => eventsOccurrenceOptions.occurrenceOptions[i].title))}
        {console.log('eventsOccurrenceOptions as object is ', Object.keys(eventsOccurrenceOptions.occurrenceOptions))}

        FUCK, LEFT OFF HERE AND CAN'T FIGURE SHIT OUT
        Objects are not valid as a React child. If you meant to render a collection of children, use an array instead.
        sort of figured it out here:<br /><br />
        {

          Object.keys(eventsOccurrenceOptions.occurrenceOptions).map(i => (<div key={i}>
            {eventsOccurrenceOptions.occurrenceOptions[i].title}
          </div>))

          // fuckinArray.map(({ title }) => (

          // { title }
          // ))
        }

      </form>

    );
  }
}


export default withTracker((eventId) => {
  const subscription = Meteor.subscribe('eventoccurrence.view', eventId.eventId);
  console.log('event id is', eventId.eventId);
  return {
    loading: !subscription.ready(),
    eventsOccurrenceOptions: Events.findOne(eventId.eventId),
  };
})(EventOccurrenceOptions);
