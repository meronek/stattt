/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, InputGroup, InputGroupButton } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Events from '../../../api/Events/Events';

class EventOccurenceOptions extends React.Component {
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
          required: 'What\'s the title for this occurence option?',
        },
      },
      submitHandler() { component.handleSubmit(component.form); },
    });
  }

  handleSubmit(form) {
    const { history } = this.props;
    const existingOccurence = this.props.occurence && this.props.occurence._id;
    const methodToCall = existingOccurence ? 'eventoccuranceoption.update' : 'eventoccuranceoption.insert';
    const occurence = {
	  // save all the checked items into the occurenceItems array here...
	  // title: form.title.value.trim(),
    // body: form.body.value.trim(),
    };

    if (existingOccurence) occurence._id = existingOccurence;

    Meteor.call(methodToCall, occurence, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        // during testing, classic add button here, but final will be add on swipe away
        const confirmation = existingOccurence ? 'Occurence option updated!' : 'Occurence option added!';
        // not resetting the form:
        // this.form.reset();
        Bert.alert(confirmation, 'success');
        // not sending them anywhere on save
        // history.push(`/documents/${documentId}`);
      }
    });
  }

  render() {
    const { occurence } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <InputGroup>
            <input type="text" className="form-control" placeholder="New Occurence Option" />
            <span className="input-group-btn">
              <Button type="submit" bsStyle="success">
                {occurence && occurence._id ? 'Update' : 'Add'}
              </Button>
            </span>
          </InputGroup>
        </FormGroup>
      </form>
    );
  }
}


export default withTracker(() => {
  const subscription = Meteor.subscribe('events');
  return {
    loading: !subscription.ready(),
    eventsOccurenceOptions: Events.find().fetch(),
  };
})(EventOccurenceOptions);
