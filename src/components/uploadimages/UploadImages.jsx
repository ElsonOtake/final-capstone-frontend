/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint linebreak-style: ["error", "windows"] */
import React, { useState, useEffect } from 'react';
import CircleLoader from 'react-spinners/ClipLoader';
import PropTypes from 'prop-types';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './UploadImages.scss';
import Button from '../button/Button';
import { API_URL } from '../../config';
import { getValidAuthSession, clearAuthSession } from '../../utils/auth';

const UploadImages = ({ btnAxn, state, vehicle }) => {
  const [gallery, setGallery] = useState(null);
  const [status, setStatus] = useState('form');

  useEffect(() => {
    setStatus('form');
  }, []);

  const handleImages = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGallery(e.target.files[0]);
    }
  };

  const closePanel = () => {
    btnAxn(!state);
    setTimeout(() => setStatus('form'), 1000);
  };

  const goBack = () => {
    setGallery(null);
    setStatus('form');
  };

  const apiConnection = async (file) => {
    const session = getValidAuthSession('current_user');
    const token = session?.token;

    if (!token) {
      clearAuthSession('current_user');
      setStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('photo_file', file);

    const url = `${API_URL}/api/v1/vehicles/${vehicle.id}/galleries`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        clearAuthSession('current_user');
        setStatus('error');
        return;
      }

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setGallery(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gallery) {
      setStatus('error');
      return;
    }

    setStatus('waiting');
    apiConnection(gallery);
  };

  return (
    <div className={state ? 'panel panel-show' : 'panel panel-hide'}>
      <div className="closeBtn" onClick={closePanel}>
        <FaTimes className="icon" />
      </div>
      <h2>IMAGES</h2>
      <div className="centerForm">
        {status === 'form' && (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h3 className="text-center">{vehicle.model}</h3>
            <br />

            <div className="add-margin-below">
              <label htmlFor="image">Search on your computer</label>
              <input
                type="file"
                id="image"
                name="image"
                className="form-field"
                onChange={handleImages}
                accept="image/*"
              />
            </div>

            <div className="form-bottom-bar">
              <Button
                type="submit"
                label="Upload"
                size="main"
                color="dark"
              />
            </div>
          </form>
        )}

        {status === 'waiting' && <CircleLoader color="#ffffff" size={60} />}

        {status === 'success' && (
          <>
            <FaCheck size={40} />
            <p>Success</p>
            <div className="form-bottom-bar">
              <Button btnAxn={goBack} label="Upload another" color="dark" />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <FaTimes size={40} />
            <p>Error, try Again</p>
            <div className="form-bottom-bar">
              <Button btnAxn={goBack} label="Back" color="dark" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

UploadImages.propTypes = {
  btnAxn: PropTypes.func.isRequired,
  state: PropTypes.bool,
  vehicle: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    model: PropTypes.string,
  }),
};

UploadImages.defaultProps = {
  state: false,
  vehicle: { id: 0, model: 'undefined' },
};

export default UploadImages;
