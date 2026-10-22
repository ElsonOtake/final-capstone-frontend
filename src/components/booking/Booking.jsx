/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint linebreak-style: ["error", "windows"] */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import './Booking.scss';
import { API_URL } from '../../config';
import { getValidAuthSession, clearAuthSession } from '../../utils/auth';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map((num) => parseInt(num, 10));
  return new Date(year, month - 1, day);
};

const Booking = ({
  btnAxn,
  close,
  state,
  vehicle: initialVehicleId,
}) => {
  const navigate = useNavigate();

  // Redux Vehicles State Guard
  const vehiclesState = useSelector((state) => state.vehicles);
  const vehiclesList = useMemo(() => {
    if (Array.isArray(vehiclesState)) return vehiclesState;
    if (Array.isArray(vehiclesState?.items)) return vehiclesState.items;
    return [];
  }, [vehiclesState]);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep state synced if initialVehicleId prop changes
  useEffect(() => {
    if (initialVehicleId) {
      setSelectedVehicleId(initialVehicleId);
    }
  }, [initialVehicleId]);

  // Derived Calculations for Days and Cost
  const { daysDisplay, costDisplay } = useMemo(() => {
    if (!startDate || !endDate || !selectedVehicleId) {
      return { daysDisplay: '---', costDisplay: '---' };
    }

    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);

    if (!start || !end || end < start) {
      return { daysDisplay: '---', costDisplay: '---' };
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((end - start) / oneDay) + 1;

    const selectedCar = vehiclesList.find(
      (car) => car.id === parseInt(selectedVehicleId, 10),
    );

    if (!selectedCar || typeof selectedCar.price !== 'number') {
      return { daysDisplay: diffDays, costDisplay: '---' };
    }

    const totalCost = diffDays * selectedCar.price;

    return {
      daysDisplay: diffDays,
      costDisplay: CURRENCY_FORMATTER.format(totalCost),
    };
  }, [startDate, endDate, selectedVehicleId, vehiclesList]);

  const sendForm = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const session = getValidAuthSession('current_user');
    if (!session || !session.token || !session.id) {
      clearAuthSession('current_user');
      return;
    }

    setIsSubmitting(true);

    const postBody = {
      start_date: startDate,
      end_date: endDate,
      city,
      vehicle_id: parseInt(selectedVehicleId, 10),
      user_id: session.id,
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/users/${session.id}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(postBody),
      });

      if (response.status === 401) {
        clearAuthSession('current_user');
        return;
      }

      if (response.ok) {
        if (typeof btnAxn === 'function') {
          btnAxn(false);
        }
        navigate('/models');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Failed to create booking.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={state ? 'booking book-show' : 'booking book-hide'}>
      <div
        className={close ? 'closeBtn' : 'hide'}
        onClick={() => typeof btnAxn === 'function' && btnAxn(!state)}
      >
        <FaTimes className="icon" />
      </div>
      <h2>BOOKING</h2>

      <div className="centerForm">
        <form onSubmit={sendForm}>
          {errorMessage && (
            <div className="add-margin-below">
              <span className="error-message active">{errorMessage}</span>
            </div>
          )}

          <div className="add-margin-below">
            <label htmlFor="vehicle">Vehicle</label>
            <select
              id="vehicle"
              name="vehicle"
              className="form-field"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Car</option>
              {vehiclesList.map((carro) => (
                <option key={carro.id} value={carro.id}>
                  {carro.brand}
                  {' '}
                  {carro.model}
                </option>
              ))}
            </select>
          </div>

          <div className="add-margin-below">
            <label htmlFor="date_start">Start Date</label>
            <input
              type="date"
              id="date_start"
              name="date_start"
              className="form-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="add-margin-below">
            <label htmlFor="date_end">End Date</label>
            <input
              type="date"
              id="date_end"
              name="date_end"
              className="form-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="add-margin-below">
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              className="form-field"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">Select one</option>
              <option value="Bogota">Bogota (Col)</option>
              <option value="Hermosillo">Hermosillo (Méx)</option>
              <option value="Manizales">Manizales (Col)</option>
              <option value="Sao Paulo">Sao Paulo (Bra)</option>
            </select>
          </div>

          <div className="resume">
            <div>
              <span>Days</span>
              <h2>{daysDisplay}</h2>
            </div>
            <div>
              <span>Cost</span>
              <h2>{costDisplay}</h2>
            </div>
          </div>

          <div className="form-bottom-bar">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Book now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Booking.propTypes = {
  btnAxn: PropTypes.func,
  close: PropTypes.bool,
  state: PropTypes.bool,
  vehicle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Booking.defaultProps = {
  btnAxn: null,
  close: true,
  state: false,
  vehicle: null,
};

export default Booking;
