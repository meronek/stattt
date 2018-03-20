/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Checkbox, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import Swipeable from 'react-swipeable';
import validate from '../../../modules/validate';
import Events from '../../../api/Events/Events';


class EventOccurrenceEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entryPage: true,
      checked: false,
    };

    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck() {
    this.setState({ checked: !this.state.checked });
  }

  // componentDidMount() {
  //   const component = this;
  //   validate(component.form, {
  //     rules: {

  //     },
  //     messages: {

  //     },
  //     submitHandler() { component.handleSubmit(component.form); },
  //   });
  // }

  swipedLeft() {
    console.log('You swiped to the Left...IF they are on the entry page, move them to the most recent record, basically, like previous');
  }
  swipedRight() {
    console.log('You swiped to the the Right...move them to the first record, basically like next when you are at the end of the record list');
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
    // const { occurenceOptions } = this.props.eventsOccurrenceOptions;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>


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


        <Swipeable
          onSwipedLeft={this.swipedLeft}
          onSwipedRight={this.swipedRight}
        >

        got occurrence options listed
        now how to handle new item?
        if there's no EventOccurrences._id then this must be a new instance. create new instance as soon as someone checks an item?
        store that id on state?
        how can I number each instance sequential? and set that as default title rather than crazy date/time stamp?


          {this.props.eventsOccurrenceOptions ?
            <ListGroup>
              {this.props.eventsOccurrenceOptions.occurrenceOptions.map((option) => {
                const { title, active } = option;
              return (
                active ?
                  <ListGroupItem key={title}>
                    <Checkbox defaultChecked={false} onChange={this.handleCheck}>{title}</Checkbox>
                  </ListGroupItem>
                : ''
              );
              })}
            </ListGroup>
        : []}

        </Swipeable>


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


export default withTracker((_id) => {
  // not sure how to get this other than from the url, this seems ghetto but fuck it
  // console.log('event id from query string is', _id.history.location.pathname.split('/')[3]);
  const eventId = _id.history.location.pathname.split('/')[3];
  // console.log('eventId is ', eventId);
  const subscription = Meteor.subscribe('event.view', eventId);

  return {
    loading: !subscription.ready(),
    eventsOccurrenceOptions: Events.findOne(eventId),
    eventId,
  };
})(EventOccurrenceEditor);

