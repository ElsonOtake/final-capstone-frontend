/* eslint linebreak-style: ["error", "windows"] */
import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BackButton.scss';

const BackButton = ({ to }) => (
  <Link to={to} className="back-link" aria-label="Go back">
    <FaArrowLeft className="icon" />
  </Link>
);

BackButton.propTypes = {
  to: PropTypes.string,
};

BackButton.defaultProps = {
  to: '/models',
};

export default BackButton;
