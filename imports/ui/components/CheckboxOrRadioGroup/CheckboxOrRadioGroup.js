import React from 'react';
import PropTypes from 'prop-types';
import './CheckboxOrRadioGroup.css';

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

const CheckboxOrRadioGroup = props => (
  <div>
    <p>{props.title}</p>
    <div className="checkbox-group">
      {props.options.map((opt, index) => (
        <label key={opt} className="checkboxlabel">
          <input
            className="form-checkbox"
            name={props.setName}
            onChange={props.controlFunc}
            value={opt}
            checked={props.selectedOptions.indexOf(opt) > -1}
            type={props.type}
          />
          <span className="checkmark" /> {opt} <span className="pull-right">{getObjects(props.allOccurrences, 'title', opt).length}</span>
        </label>
        ))}
    </div>
  </div>
);

CheckboxOrRadioGroup.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
  setName: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  controlFunc: PropTypes.func.isRequired,
  allOccurrences: PropTypes.array.isRequired,
};

export default CheckboxOrRadioGroup;
