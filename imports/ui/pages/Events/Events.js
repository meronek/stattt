import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Well, Alert, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { Counts } from 'meteor/tmeasday:publish-counts';
import EventsCollection from '../../../api/Events/Events';
import { monthDayYear } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

// import './Documents.scss';
const recordsPerPage = new ReactiveVar(10);

const handleRemove = (eventId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('event.remove', eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Event deleted!', 'success');
      }
    });
  }
};

const Events = ({
  loading, events, match, history, totalEvents,
}) => (!loading ? (
  <div className="Events">
    <div className="page-header clearfix">
      <h4 className="pull-left">Events</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Event</Link>
    </div>
    {events.length ?
          events.map(({
            _id, title, ispublic, createdAt, occurrenceOptions,
          }) => (
            <Well key={_id}>
              <Row>
                <Col sm={12}>
                  <h4>{title}</h4>
                  {occurrenceOptions.filter(occurrenceOptions => occurrenceOptions.active === true).length} {occurrenceOptions.filter(occurrenceOptions => occurrenceOptions.active === true).length === 1 ? 'Option' : 'Options'}, {monthDayYear(createdAt)}, {ispublic ? 'Public' : 'Private'}

                </Col>
              </Row>
              <Row className="well-sm">
                <Col xs={4}>
                  <Button
                    bsStyle="primary"
                    onClick={() => history.push(`${match.url}/log/${_id}`)}
                    block
                  >
                  Log
                  </Button>
                </Col>
                <Col xs={4}>
                  <Button
                    bsStyle="primary"
                    onClick={() => history.push(`${match.url}/${_id}`)}
                    block
                  >
                  Options
                  </Button>
                </Col>
                <Col xs={4}>
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemove(_id)}
                    block
                  >
                  Delete
                  </Button>
                </Col>
              </Row>
            </Well>
          ))
         : <Alert bsStyle="warning">No events yet!</Alert>}
    {console.log('total events is', totalEvents, 'and events.length is ', events.length)}
    {events.length === totalEvents
        ?
          ''
        : <input className="btn btn-primary" type="button" onClick={() => recordsPerPage.set(recordsPerPage.get() + 10)} value="Show More" />
        }


  </div>

) : <Loading />);

Events.propTypes = {
  loading: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  // using this for pagination: https://atmospherejs.com/percolate/paginated-subscription
  // also, watch this video: https://www.youtube.com/watch?v=FyUP4qvoroU
  const subscription = Meteor.subscribeWithPagination('events', recordsPerPage.get());
  const subscriptioncount = Meteor.subscribe('events.count');
  console.log('subscriptioncount is ', subscriptioncount, 'counts get is ', Counts.get('events.count'));
  return {
    loading: !subscription.ready(),
    events: EventsCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
    totalEvents: Counts.get('events.count'),
  };
})(Events);
