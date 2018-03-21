/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import Swipeable from 'react-swipeable';
import Events from '../../../api/Events/Events';
import CheckboxOrRadioGroup from '../CheckboxOrRadioGroup/CheckboxOrRadioGroup';


class EventOccurrenceEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventId: this.props.eventId,
      selectedOccurrences: [],
    };

    this.handleOccurrenceSelection = this.handleOccurrenceSelection.bind(this);
  }

  handleOccurrenceSelection(e) {
    const newSelection = e.target.value;
    let newSelectionArray;

    if (this.state.selectedOccurrences.indexOf(newSelection) > -1) {
      newSelectionArray = this.state.selectedOccurrences.filter(s => s !== newSelection);
    } else {
      newSelectionArray = [...this.state.selectedOccurrences, newSelection];
    }
    // set the occurences - is this a new one or existing?
    this.setState({ selectedOccurrences: newSelectionArray });
    if (this.state.existingEventOccurrenceId) {
      console.log('update existing EventOccurrenceId ', this.state.existingEventOccurrenceId);
    } else {
      const occurrence = {
        eventId: this.props.eventId,
        title: 'how the fuck do I generate this',
        occurrenceItems: newSelectionArray,
      };
      console.log('create a  new event occurrence', occurrence);
      Meteor.call('eventOccurrence.insert', occurrence, (error) => {
        if (error) {
          Bert.alert(`Error: ${error.reason}`, 'danger');
        } else {
          // during testing, classic add button here, but final will be add on swipe away
          const confirmation = `Occurrence instance created: ${occurrence._id}`;
          // this.form.reset();
          Bert.alert(confirmation, 'success');
          this.setState({ existingEventOccurrenceId: occurrence._id });
          // not sending them anywhere on save
          // history.push(`/documents/${documentId}`);
        }
      });
    }
  }


  swipedLeft() {
    console.log('You swiped to the Left...IF they are on the entry page, move them to the most recent record, basically, like previous. ');
  }
  swipedRight() {
    console.log('You swiped to the the Right...move them to the first record, basically like next when you are at the end of the record list');
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
            <div>
              <CheckboxOrRadioGroup
                title="Check all that apply:"
                setName="occurences"
                type="checkbox"
                controlFunc={this.handleOccurrenceSelection}
                options={this.props.eventsOccurrenceOptions.occurrenceOptions.map(opt => opt.title)}
                selectedOptions={this.state.selectedOccurrences}
              />
            </div>
        : ''}


        </Swipeable>


      </form>
    );
  }
}

EventOccurrenceEditor.defaultProps = {
  occurrenceOptions: [],
};

EventOccurrenceEditor.propTypes = {
  occurrenceOptions: PropTypes.array,
  eventsOccurrenceOptions: PropTypes.object,
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

