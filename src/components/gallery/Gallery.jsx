/* eslint linebreak-style: ["error", "windows"] */
import React from 'react';
import PropTypes from 'prop-types';
import './Gallery.scss';

const Gallery = ({ data, btnAxn }) => (
  <div className="slider">
    {data.map((item, index) => {
      // Handle both object format ({ photo: 'url' }) and string array format ('url')
      const photoUrl = typeof item === 'string' ? item : item?.photo;
      const key = typeof item === 'object' && item?.id ? item.id : index;

      if (!photoUrl) return null;

      return (
        <button
          type="button"
          key={key}
          className="slider-item"
          onClick={() => btnAxn(photoUrl)}
          style={{
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-label={`View image ${index + 1}`}
        />
      );
    })}
  </div>
);

Gallery.propTypes = {
  btnAxn: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        photo: PropTypes.string,
      }),
    ]),
  ),
};

Gallery.defaultProps = {
  data: [],
};

export default Gallery;
