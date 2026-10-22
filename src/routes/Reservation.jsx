/* eslint linebreak-style: ["error", "windows"] */
import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getValidAuthSession } from '../utils/auth';
import { getVehicles } from '../redux/vehicles/vehicles';
import { getReservations } from '../redux/users/users';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const ReservationScreen = () => {
  const dispatch = useDispatch();

  // Safe Session Access
  const session = getValidAuthSession('current_user');
  const userName = session?.name || 'User';

  // Redux Vehicles Guard
  const vehiclesState = useSelector((state) => state.vehicles);
  const vehiclesList = useMemo(() => {
    if (Array.isArray(vehiclesState)) return vehiclesState;
    if (Array.isArray(vehiclesState?.items)) return vehiclesState.items;
    return [];
  }, [vehiclesState]);

  // Redux Reservations Guard
  const reservationsState = useSelector((state) => state.reservations);
  const reservationsList = useMemo(() => {
    if (Array.isArray(reservationsState)) return reservationsState;
    if (Array.isArray(reservationsState?.items)) return reservationsState.items;
    return [];
  }, [reservationsState]);

  // Ensure state is fetched if empty on direct load
  useEffect(() => {
    if (!vehiclesList.length) dispatch(getVehicles());
    if (!reservationsList.length) dispatch(getReservations());
  }, [dispatch, vehiclesList.length, reservationsList.length]);

  const getVehicle = (vehicleId) => (
    vehiclesList.find((car) => Number(car.id) === Number(vehicleId))
  );

  return (
    <div className="container page-reservation">
      <div className="info-container">
        <h2>{`${userName}'s reservations`}</h2>
        <p>
          Know all future and past reservations made by you, know the selected vehicle
          and the date range you choose.
        </p>

        {reservationsList.length === 0 && (
          <p className="no-reservations-message">No reservations yet</p>
        )}

        {reservationsList.map((item) => {
          const vehicle = getVehicle(item.vehicle_id);
          const imageUrl = vehicle?.galleries?.[0]?.photo || vehicle?.image || DEFAULT_IMAGE;
          const brand = vehicle?.brand || 'Vehicle';
          const model = vehicle?.model || 'Model';

          return (
            <article key={item.id}>
              <div className="main-info">
                <Link to={`/models/${item.vehicle_id}`}>
                  <div className="reservation-photo">
                    <img
                      src={imageUrl}
                      alt={`${brand} ${model}`}
                    />
                  </div>
                </Link>
                <div className="car-data">
                  <h4>{brand}</h4>
                  <h2 className="reservation-model">{model}</h2>
                </div>
              </div>

              <div className="text-end">
                <p>{item.city}</p>
              </div>

              <div className="dateRange">
                <div>
                  <span>Start</span>
                  <p>{item.start_date}</p>
                </div>
                <div>
                  <span>End</span>
                  <p>{item.end_date}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ReservationScreen;
