import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import EventOccurrences from '../../../api/EventOccurrences/EventOccurrences';
import { timeago } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';


const handleRemove = (_id) => {
  if (confirm('Are you sure? This is permanent!')) {
	  const recordID = { _id };
    Meteor.call('eventOccurrence.remove', recordID, (error) => {
      if (error) {
        Bert.alert(`shit${error.reason}`, 'danger');
      } else {
        Bert.alert('Event occurrence deleted!', 'success');
      }
    });
  }
};

const EventOccurrenceViewer = ({
  loading, eventOccurrences, match, history, eventId,
}) => (!loading ? (
  <div className="EventsOccurrences">
    <div className="page-header clearfix">
      <h4 className="pull-left">Event Occurrences Log</h4>
      <Link className="btn btn-success pull-right" to={`/events/log/${eventId}`}>Log New</Link>
    </div>
    {eventOccurrences.length > 0 ?
          eventOccurrences.map(({
            _id, createdAt,
          }, index) => (
            <Row key={_id} className="well-sm">
              <Col xs={9}>
                {eventOccurrences[index].occurrenceItems.length} {eventOccurrences[index].occurrenceItems.length > 1 ? 'things' : 'thing'} logged {timeago(createdAt)}
                <ul>
                  {eventOccurrences[index].occurrenceItems.map(thing => <li key={thing.title}>{thing.title}</li>)}
                </ul>
              </Col>
              <Col xs={3}>
                <Button
                  bsStyle="danger"
                  className="btn-sm"
                  onClick={() => handleRemove(_id)}
                  block
                >
                  Delete
                </Button>
              </Col>
            </Row>

          ))
         : <Alert bsStyle="warning">No event occurrences yet!</Alert>}
  </div>
) : <Loading />);

EventOccurrenceViewer.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker((_id) => {
  // console.log('id is', _id.match.params._id);
  const eventId = _id.match.params._id;
  const subscription = Meteor.subscribe('eventoccurrences.view', eventId);
  return {
    loading: !subscription.ready(),
    eventOccurrences: EventOccurrences.find({ eventId }, { sort: { createdAt: -1 } }).fetch(),
    eventId,
  };
})(EventOccurrenceViewer);
