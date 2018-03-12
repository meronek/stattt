/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class EventOccurenceEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {

      },
      messages: {

      },
      submitHandler() { component.handleSubmit(component.form); },
    });
  }

  handleSubmit(form) {
    const { history } = this.props;
    const existingOccurence = this.props.occurence && this.props.occurence._id;
    const methodToCall = existingOccurence ? 'eventoccurances.update' : 'eventoccurances.insert';
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
        const confirmation = existingOccurence ? 'Occurence updated!' : 'Occurence added!';
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
        <div>
		  here, build the list of occurence options for this event and give them checkboxes next to each
        </div>
        <Button type="submit" bsStyle="success">
          {occurence && occurence._id ? 'Save Changes' : 'Add Occurence'}
        </Button>
      </form>
    );
  }
}

EventOccurenceEditor.defaultProps = {
  occurence: { occurenceItems: {} },
};

EventOccurenceEditor.propTypes = {
  occurence: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default EventOccurenceEditor;
