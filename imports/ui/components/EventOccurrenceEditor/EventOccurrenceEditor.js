/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Alert, ButtonToolbar } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import Swipeable from 'react-swipeable';
import { CSSTransitionGroup } from 'react-transition-group';
import Events from '../../../api/Events/Events';
import EventOccurrences from '../../../api/EventOccurrences/EventOccurrences';
import EventOccurrencesCharts from '../EventOccurrencesCharts/EventOccurrencesCharts';
import EventOccurrenceOptionInsert from '../EventOccurrenceOptionInsert/EventOccurrenceOptionInsert';
import './EventOccurrenceEditor.css';
import CheckboxOrRadioGroup from '../CheckboxOrRadioGroup/CheckboxOrRadioGroup';


class EventOccurrenceEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOccurrences: [],
      showAnimation: true,
    };

    this.handleOccurrenceSelection = this.handleOccurrenceSelection.bind(this);
    this.newOccurrence = this.newOccurrence.bind(this);
    this.swipedLeft = this.swipedLeft.bind(this);
    this.swipedRight = this.swipedRight.bind(this);
  }

  newOccurrence() {
    // for a new Occurrence, simply clear out state variable and checkboxes
    this.setState({ selectedOccurrences: [], existingEventOccurrenceId: null });
    // here, set showAnimation to the opposite of whatever it was
    // this will trigger a new animation to fire
    this.setState({ showAnimation: !this.state.showAnimation });
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
    const occurrence = {
      eventId: this.props.eventId,
      title: 'Not used right now.',
      occurrenceItems: [], // initially, leave blank, push and pull items as checkboxes are set
    };


    // HOLY SHIT, FINALLY GOT THIS SAVING IN THERE CORRECTLY, NOW JUST NEED TO CHECK IF THE CHECKBOX WAS UNCHECKED, IF SO, REMOVE THE ITEM

    // this if means it's in there already, so we're removing it:
    let methodToCall = 'eventOccurrenceItem.insert';
    if (this.state.selectedOccurrences.indexOf(newSelection) > -1) {
      methodToCall = 'eventOccurrenceItem.remove';
    }

    if (this.state.existingEventOccurrenceId) {
      // occurrence._id = this.state.existingEventOccurrenceId;
      const options = {};
      options._id = this.state.existingEventOccurrenceId;
      options.title = newSelection;
      Meteor.call(methodToCall, options, (error) => {
        if (error) {
          Bert.alert(`Error: ${error.reason}`, 'danger');
          // console.log('occurrence in the error is ', occurrence);
        } else {
          // skip alert, it's saved, nothing to do here
        }
      });
    } else {
      // if we don't have an existing eventoccurrence, first we need to create one:
      Meteor.call('eventOccurrence.insert', occurrence, (error, occurrenceId) => {
        if (error) {
          Bert.alert(`Error: ${error.reason}`, 'danger');
        } else {
          // after we create it, set the id of this occurrence:
          this.setState({ existingEventOccurrenceId: occurrenceId });
          // now here, handle updating the list
          // here, determine if it's checked or unchecked

          const options = {};
          options._id = occurrenceId;
          options.title = newSelection;
          Meteor.call(methodToCall, options, (deeperror) => {
            if (error) {
              Bert.alert(`Error: ${deeperror.reason}`, 'danger');
              // console.log('occurrence in the error is ', occurrence);
            } else {
              // console.log('method called is', methodToCall, 'push done, returned', returnvalue);
            }
          });
        }
      });
    }
  }


  swipedLeft() {
    // console.log('You swiped to the Left...IF they are on the entry page, move them to the most recent record, basically, like previous. this is', this);
    this.newOccurrence();
  }
  swipedRight() {
    // console.log('You swiped to the the Right...move them to the first record, basically like next when you are at the end of the record list');
    this.props.history.push(`/events/occurrences/${this.props.eventId}`);
  }


  render() {
    // const { occurenceOptions } = this.props.eventsOccurrenceOptions;

    return (
      <Swipeable
        onSwipedLeft={this.swipedLeft}
        onSwipedRight={this.swipedRight}
      >
        <CSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={300}
          transitionEnter
          transitionLeave
        >

          <div key={this.state.showAnimation}>

            <h3>{this.props.eventsOccurrenceOptions ? this.props.eventsOccurrenceOptions.title : ''}</h3>

            {this.props.eventsOccurrenceOptions ?
              <div>
                <CheckboxOrRadioGroup
                  title="Log what just went down:"
                  setName="occurences"
                  type="checkbox"
                  controlFunc={this.handleOccurrenceSelection}
                  options={this.props.eventsOccurrenceOptions.occurrenceOptions.map(opt => (opt.active ? opt.title : '')).filter(title => title.length > 0)}
                  selectedOptions={this.state.selectedOccurrences}
                  allOccurrences={this.props.allOccurrences}
                  eventId={this.props.eventId}
                />
              </div>
        : ''}

            {this.state.existingEventOccurrenceId ?
              <Alert bsStyle="success">{this.state.selectedOccurrences.length} {this.state.selectedOccurrences.length > 1 ? 'options' : 'option'} saved. Swipe left for a new occurrence.
              </Alert> : <Alert>Select options to log above.</Alert>}

            <EventOccurrenceOptionInsert eventId={this.props.eventId} />

            {this.state.existingEventOccurrenceId ?
              <ButtonToolbar>

                <Button className="btn btn-primary" onClick={this.newOccurrence}>New Occurrence</Button>

              </ButtonToolbar>
            : ''}


          </div>
        </CSSTransitionGroup>
        {this.props.eventsOccurrenceOptions ?
          <EventOccurrencesCharts
            options={this.props.eventsOccurrenceOptions.occurrenceOptions.map(opt => (opt.active ? opt.title : '')).filter(title => title.length > 0)}
            allOccurrences={this.props.allOccurrences}
            eventId={this.props.eventId}
          /> : ''}

        <div className="well">
          <h4>Tips:</h4>
          <ul>
            <li>Swipe left for a new occurrence</li>
            <li>Swipe right to view existing occurrences</li>
          </ul>

          <div className="text-center">
            <Button
              className="btn btn-primary"

              onClick={() => this.props.history.push(`/events/occurrences/${this.props.eventId}`)}
            >View {this.props.totalOccurrencesLogged} {this.props.totalOccurrencesLogged === 1 ? 'Occurrence' : 'Occurences'}
            </Button>
          </div>
        </div>

      </Swipeable>
    );
  }
}

EventOccurrenceEditor.defaultProps = {
  occurrenceOptions: [],
};

EventOccurrenceEditor.propTypes = {
  occurrenceOptions: PropTypes.array,
  eventsOccurrenceOptions: PropTypes.object,
  eventId: PropTypes.string.isRequired,
};


export default withTracker((_id) => {
  // not sure how to get this other than from the url, this seems ghetto but fuck it
  // console.log('event id from query string is', _id.history.location.pathname.split('/')[3]);
  const eventId = _id.history.location.pathname.split('/')[3];
  // console.log('history is ', _id.history);
  const subscription = Meteor.subscribe('event.view', eventId);
  return {
    loading: !subscription.ready(),
    eventsOccurrenceOptions: Events.findOne(eventId),
    eventId,
    totalOccurrencesLogged: EventOccurrences.find({ eventId }).fetch().length,
    allOccurrences: EventOccurrences.find({ eventId }).fetch(),
    history: _id.history,
  };
})(EventOccurrenceEditor);

