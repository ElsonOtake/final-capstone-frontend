/* eslint linebreak-style: ["error", "windows"] */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UploadImages from '../../components/uploadimages/UploadImages';
import Button from '../../components/button/Button';
import { API_URL } from '../../config';
import { getValidAuthSession, clearAuthSession } from '../../utils/auth';
import { getVehicles } from '../../redux/vehicles/vehicles';

const AdminScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Vehicles State Guard
  const vehiclesState = useSelector((state) => state.vehicles);
  const vehiclesList = useMemo(() => {
    if (Array.isArray(vehiclesState)) return vehiclesState;
    if (Array.isArray(vehiclesState?.items)) return vehiclesState.items;
    return [];
  }, [vehiclesState]);

  const [uploadVisible, setUploadVisible] = useState(false);
  const [vehicleSelected, setVehicleSelected] = useState({ id: 0, model: 'undefined' });
  const [isIntruder, setIsIntruder] = useState(true);

  useEffect(() => {
    const session = getValidAuthSession('current_user');
    if (session && session.role === 'admin') {
      setIsIntruder(false);
    } else {
      setIsIntruder(true);
    }
  }, []);

  const showUpload = (car = null) => {
    if (car) setVehicleSelected(car);
    setUploadVisible(!uploadVisible);
  };

  const addVehicle = () => navigate('/admin/new', { replace: true });

  const deleteVehicle = async (vehicle) => {
    const session = getValidAuthSession('current_user');
    if (!session || !session.token) {
      clearAuthSession('current_user');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/vehicles/${vehicle.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.status === 401) {
        clearAuthSession('current_user');
        return;
      }

      if (response.ok) {
        // Refresh vehicle list in Redux store or navigate smoothly
        dispatch(getVehicles());
        navigate('/models');
      }
    } catch {
      // Intentionally ignoring network errors on deletion
    }
  };

  if (isIntruder) {
    return (
      <div className="container page-admin">
        <h1>You need admin access for this page</h1>
        <iframe
          title="you shall not pass"
          src="https://giphy.com/embed/njYrp176NQsHS"
          width="480"
          height="200"
          frameBorder="0"
          className="giphy-embed"
        />
      </div>
    );
  }

  return (
    <div className="container page-admin">
      <div className="info-container">
        <Button btnAxn={addVehicle} label="Add" />
        <br />

        {vehiclesList.map((car) => (
          <article key={car.id}>
            <div className="main-info">
              <p>
                {`${car.year}. ${car.brand} ${car.model} - Rent price: ${car.price}(USD)`}
              </p>
            </div>
            <div className="action-btn text-end">
              <Button
                btnAxn={showUpload}
                label="Images"
                value={car}
                size="small"
              />
              <Button
                btnAxn={deleteVehicle}
                label="Delete"
                value={{ id: car.id }}
                size="small"
              />
            </div>
          </article>
        ))}
      </div>
      <UploadImages
        btnAxn={showUpload}
        state={uploadVisible}
        vehicle={vehicleSelected}
      />
    </div>
  );
};

export default AdminScreen;
