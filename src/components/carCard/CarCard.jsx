/* eslint linebreak-style: ["error", "windows"] */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './CarCard.scss';

const MAX_CHARS = 110;

const CarCard = ({
  brand,
  model,
  description,
  image,
  id,
}) => {
  const safeDescription = description || '';
  const showDescription = safeDescription.length > MAX_CHARS
    ? `${safeDescription.slice(0, MAX_CHARS).trim()}...`
    : safeDescription;

  return (
    <li className="car-card">
      <div className="card-container">
        <Link to={`/models/${id}`}>
          <img
            src={image}
            alt={`${brand} ${model}`}
            className="car-card-image"
          />
        </Link>
        <h2>{brand}</h2>
        <h2>{model}</h2>
        <hr className="division-span" />
        <p className="car-description">{showDescription}</p>
      </div>
    </li>
  );
};

CarCard.propTypes = {
  brand: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

CarCard.defaultProps = {
  description: '',
};

export default CarCard;
