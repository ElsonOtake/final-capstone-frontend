/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint linebreak-style: ["error", "windows"] */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from '../../components/form/Form';
import { API_URL } from '../../config';
import { getValidAuthSession, clearAuthSession } from '../../utils/auth';

const NewScreen = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const session = getValidAuthSession('current_user');
    if (!session || !session.token) {
      clearAuthSession('current_user', '/login');
      return;
    }

    setIsSubmitting(true);

    const postBody = {
      brand: e.target.brand.value,
      model: e.target.model.value,
      year: e.target.year.value,
      country: e.target.country.value,
      color: e.target.color.value,
      power: e.target.power.value,
      max_speed: e.target.maxSpeed.value,
      acceleration: e.target.acceleration.value,
      price: parseInt(e.target.price.value, 10),
      description: e.target.description.value,
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(postBody),
      });

      if (response.status === 401) {
        clearAuthSession('current_user', '/login');
        return;
      }

      if (response.ok) {
        navigate('/models');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Failed to create vehicle.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-admin">
      <div className="info-container">
        <h1>Add new car</h1>

        {errorMessage && (
          <div className="add-margin-below">
            <span className="error-message active">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={formSubmit}>
          <Form />

          <div className="grid-flex">
            <Link to="/admin">
              Back to admin
            </Link>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewScreen;
