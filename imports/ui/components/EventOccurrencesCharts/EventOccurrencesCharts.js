import React from 'react';
import { ProgressBar } from 'react-bootstrap';

function getObjects(obj, key, val) {
  let objects = [];
  for (const i in obj) {
	  if (!obj.hasOwnProperty(i)) continue;
	  if (typeof obj[i] === 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));
	  } else if (i == key && obj[key] == val) {
      objects.push(obj);
	  }
  }
  return objects;
}
const EventOccurrenceCharts = props => (
  <div>
    <h3>Summary of {props.allOccurrences.length} {props.allOccurrences.length === 1 ? 'Occurrence' : 'Occurrences'}</h3>

    {props.options.map((opt, index) => (
      <div key={opt}>
        <strong>{opt}: {getObjects(props.allOccurrences, 'title', opt).length}</strong>

        <ProgressBar
          now={Math.round((getObjects(props.allOccurrences, 'title', opt).length / props.allOccurrences.length) * 100)}
          bsStyle="success"
          striped
          label={`${Math.round((getObjects(props.allOccurrences, 'title', opt).length / props.allOccurrences.length) * 100)}%`}
        />

      </div>
        ))}


  </div>
);

export default EventOccurrenceCharts;
