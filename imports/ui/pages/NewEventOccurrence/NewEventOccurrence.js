import React from 'react';
import PropTypes from 'prop-types';
import EventOccurrenceEditor from '../../components/EventOccurrenceEditor/EventOccurrenceEditor';

const NewEventOccurrence = ({ history }) => (
  <div className="NewEvent">
    <EventOccurrenceEditor history={history} />
  </div>
);

NewEventOccurrence.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewEventOccurrence;
