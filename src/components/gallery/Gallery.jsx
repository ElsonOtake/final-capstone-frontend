/* eslint linebreak-style: ["error", "windows"] */
import React from 'react';
import PropTypes from 'prop-types';
import './Gallery.scss';

const Gallery = ({ data, btnAxn }) => (
  <div className="slider">
    {data.map((photo, index) => {
      const photoUrl = photo.photo || photo;
      const photoKey = photo.id || photoUrl || index;

      return (
        <button
          type="button"
          key={photoKey}
          className="slider-item"
          onClick={() => btnAxn(photoUrl)}
          style={{ backgroundImage: `url(${photoUrl})` }}
          aria-label="View photo"
        />
      );
    })}
  </div>
);

Gallery.propTypes = {
  btnAxn: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      photo: PropTypes.string,
    }),
  ),
};

Gallery.defaultProps = {
  data: [],
};

export default Gallery;
