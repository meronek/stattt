import React from 'react';
import PropTypes from 'prop-types';
import EventEditor from '../../components/EventEditor/EventEditor';

const NewEvent = ({ history }) => (
  <div className="NewEvent">
    <h4 className="page-header">New Event</h4>
    <EventEditor history={history} />
  </div>
);

NewEvent.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewEvent;
