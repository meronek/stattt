import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Events from '../../../api/Events/Events';
import EventEditor from '../../components/EventEditor/EventEditor';
import NotFound from '../NotFound/NotFound';

const EditEvent = ({ event, history }) => (event ? (
  <div className="EditEvent">
    <h4 className="page-header">{`Editing "${event.title}"`}</h4>
    <EventEditor event={event} history={history} />
  </div>
) : <NotFound />);

EditEvent.defaultProps = {
  event: null,
};

EditEvent.propTypes = {
  event: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const eventId = match.params._id;
  const subscription = Meteor.subscribe('event.view', eventId);

  return {
    loading: !subscription.ready(),
    event: Events.findOne(eventId),
  };
})(EditEvent);
