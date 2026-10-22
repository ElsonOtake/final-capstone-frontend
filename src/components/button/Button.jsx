/* eslint linebreak-style: ["error", "windows"] */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FaArrowCircleRight,
  FaCalendarAlt,
  FaCheck,
} from 'react-icons/fa';
import './Button.scss';

const ICONS = {
  calendar: FaCalendarAlt,
  arrow: FaArrowCircleRight,
  check: FaCheck,
};

const Button = ({
  btnAxn,
  color,
  disabled,
  iconStart,
  iconEnd,
  label,
  size,
  type,
  value,
}) => {
  const StartIcon = ICONS[iconStart];
  const EndIcon = ICONS[iconEnd];

  const handleClick = (e) => {
    if (typeof btnAxn === 'function') {
      btnAxn(value !== null ? value : e);
    }
  };

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={`${size} color-${color}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {StartIcon && <StartIcon className="icon icon-start" />}
      {label}
      {EndIcon && <EndIcon className="icon icon-end" />}
    </button>
  );
};

Button.propTypes = {
  btnAxn: PropTypes.func,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  iconStart: PropTypes.string,
  iconEnd: PropTypes.string,
  label: PropTypes.string.isRequired,
  size: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  value: PropTypes.any,
};

Button.defaultProps = {
  btnAxn: null,
  color: 'primary',
  disabled: false,
  iconStart: null,
  iconEnd: null,
  size: 'normal',
  type: 'button',
  value: null,
};

export default Button;
