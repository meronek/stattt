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

  handleRemoveOption(optionTitle) {
    const { match, history } = this.props;
    Meteor.call('events.removeOccurrenceOption', {
      optionTitle,
      _id: this.props.eventId,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Occurrence removed.', 'success');
        // console.log('option title is', optionTitle);
      }
    });
  }

  handleReactivateOption(optionTitle) {
    const { match, history } = this.props;
    Meteor.call('events.reactivateOccurrenceOption', {
      optionTitle,
      _id: this.props.eventId,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Occurrence reactivated.', 'success');
        // console.log('option title is', optionTitle);
      }
    });
  }

  render() {
    const { eventsOccurrenceOptions } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup className="well">
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

        {

          Object.keys(eventsOccurrenceOptions.occurrenceOptions).map(i => (
            <div key={i}>
              {eventsOccurrenceOptions.occurrenceOptions[i].active ?
                <div className="clearfix well-sm">
                  {eventsOccurrenceOptions.occurrenceOptions[i].title}
                  <Button className="btn-sm pull-right btn-danger" onClick={() => this.handleRemoveOption(eventsOccurrenceOptions.occurrenceOptions[i].title)}>Remove</Button>
                </div>
                :
                ''
              }
            </div>
            ))
        }

        <h4>Inactive Options</h4>
        {

Object.keys(eventsOccurrenceOptions.occurrenceOptions).map(i => (
  <div key={i}>
    {eventsOccurrenceOptions.occurrenceOptions[i].active === false ?
      <div className="clearfix well-sm">
        {eventsOccurrenceOptions.occurrenceOptions[i].title}
        <Button className="btn-sm pull-right btn-success" onClick={() => this.handleReactivateOption(eventsOccurrenceOptions.occurrenceOptions[i].title)}>Activate</Button>
      </div>
      :
      ''
    }
  </div>
  ))
}

      </form>

    );
  }
}


export default withTracker((eventId) => {
  const subscription = Meteor.subscribe('event.view', eventId.eventId);
  // console.log('event id is', eventId.eventId);
  return {
    loading: !subscription.ready(),
    eventsOccurrenceOptions: Events.findOne(eventId.eventId),
  };
})(EventOccurrenceOptions);
