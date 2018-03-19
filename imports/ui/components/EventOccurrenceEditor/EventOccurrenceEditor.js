/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Swipeable from 'react-swipeable';
import validate from '../../../modules/validate';


class EventOccurrenceEditor extends React.Component {
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

  swipedLeft() {
    console.log('You swiped to the Left...IF they are on the entry page, move them to the most recent record, basically, like previous');
  }
  swipedRight() {
    console.log('You swiped to the the Right...move them to the first record, basically like next when you are at the end of the record list');
  }
  swipedUp() {
    console.log('You swiped Up...move them to the new occurrence form.');
  }

  handleSubmit(form) {
    const { history } = this.props;
    const existingOccurrence = this.props.occurrence && this.props.occurrence._id;
    const methodToCall = existingOccurrence ? 'eventoccurances.update' : 'eventoccurances.insert';
    const occurrence = {
	  // save all the checked items into the occurrenceItems array here...
	  // title: form.title.value.trim(),
    // body: form.body.value.trim(),
    };

    if (existingOccurrence) occurrence._id = existingOccurrence;

    Meteor.call(methodToCall, occurrence, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        // during testing, classic add button here, but final will be add on swipe away
        const confirmation = existingOccurrence ? 'Occurrence updated!' : 'Occurrence added!';
        // not resetting the form:
        // this.form.reset();
        Bert.alert(confirmation, 'success');
        // not sending them anywhere on save
        // history.push(`/documents/${documentId}`);
      }
    });
  }

  render() {
    const { occurrence } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <Swipeable
          onSwipedLeft={this.swipedLeft}
          onSwipedRight={this.swipedRight}
          onSwipedUp={this.swipedUp}
        >

          <Row>
            <Col xs={12} className="text-center">
              <h4>Start Logging</h4>
            </Col>
            <Col xs={4} className="text-center">
              Swipe Up:<br />New
            </Col>
            <Col xs={4} className="text-center">
              Swipe Right:<br />View Last
            </Col>
            <Col xs={4} className="text-center">
              Swipe Left:<br />View First
            </Col>
            
            
          </Row>
        </Swipeable>
        here, build the list of occurrence options for this event and give them checkboxes next to each.
        <Button type="submit" bsStyle="success">
          {occurrence && occurrence._id ? 'Save Changes' : 'Add Occurrence'}
        </Button>
      </form>
    );
  }
}

EventOccurrenceEditor.defaultProps = {
  occurrence: { occurrenceItems: {} },
};

EventOccurrenceEditor.propTypes = {
  occurrence: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default EventOccurrenceEditor;
