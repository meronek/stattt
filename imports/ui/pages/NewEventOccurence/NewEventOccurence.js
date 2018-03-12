import React from 'react';
import PropTypes from 'prop-types';
import EventOccurenceEditor from '../../components/EventOccurenceEditor/EventOccurenceEditor';

const NewEventOccurence = ({ history }) => (
  <div className="NewEvent">
    <h4 className="page-header">New Occurance</h4>
    <EventOccurenceEditor history={history} />
  </div>
);

NewEventOccurence.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewEventOccurence;
