import React from 'react';
import PropTypes from 'prop-types';
import './CheckboxOrRadioGroup.css';

const CheckboxOrRadioGroup = props => (
  <div>
    <label className="form-label">{props.title}</label>
    <div className="checkbox-group">
      {props.options.map(opt => (
        <label key={opt} className="checkboxlabel">
          <input
            className="form-checkbox"
            name={props.setName}
            onChange={props.controlFunc}
            value={opt}
            checked={props.selectedOptions.indexOf(opt) > -1}
            type={props.type}
          /> <span className="checkmark" /> {opt}
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
  selectedOptions: PropTypes.array,
  controlFunc: PropTypes.func.isRequired,
};

export default CheckboxOrRadioGroup;
