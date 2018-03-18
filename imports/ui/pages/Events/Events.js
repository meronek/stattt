import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Well, Alert, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import EventsCollection from '../../../api/Events/Events';
import { monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

// import './Documents.scss';

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
  loading, events, match, history,
}) => (!loading ? (
  <div className="Events">
    <div className="page-header clearfix">
      <h4 className="pull-left">Events</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Event</Link>
    </div>
    {events.length ?
          events.map(({
            _id, title, createdAt,
          }) => (
            <Well key={_id}>
              <Row>
                <Col sm={12}>{title}<br />{monthDayYearAtTime(createdAt)}
                </Col>
              </Row>
              <Row>
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
  </div>
) : <Loading />);

Events.propTypes = {
  loading: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('events');
  return {
    loading: !subscription.ready(),
    events: EventsCollection.find().fetch(),
  };
})(Events);
