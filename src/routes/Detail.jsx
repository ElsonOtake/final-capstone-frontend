/* eslint-disable import/no-named-as-default */
/* eslint linebreak-style: ["error", "windows"] */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BackButton from '../components/backbutton/BackButton';
import Booking from '../components/booking/Booking';
import Button from '../components/button/Button';
import Gallery from '../components/gallery/Gallery';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const DetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Redux Store Guard
  const vehiclesState = useSelector((state) => state.vehicles);
  const vehiclesList = useMemo(() => {
    if (Array.isArray(vehiclesState)) return vehiclesState;
    if (Array.isArray(vehiclesState?.items)) return vehiclesState.items;
    return [];
  }, [vehiclesState]);

  // Find vehicle cleanly
  const car = useMemo(
    () => vehiclesList.find((element) => String(element.id) === String(id)),
    [vehiclesList, id],
  );

  const gallery = car?.galleries || [];

  const [background, setBackground] = useState(DEFAULT_IMAGE);
  const [bookVisible, setBookVisible] = useState(false);

  // Synchronize initial background image when car or gallery loads
  useEffect(() => {
    if (gallery.length > 0 && gallery[0]?.photo) {
      setBackground(gallery[0].photo);
    } else if (car?.image) {
      setBackground(car.image);
    } else {
      setBackground(DEFAULT_IMAGE);
    }
  }, [car, gallery]);

  const showBooking = () => setBookVisible((prev) => !prev);
  const changeBG = (newbg) => setBackground(newbg);

  // Render Loading / Not Found fallback while fetching or if ID is invalid
  if (vehiclesList.length > 0 && !car) {
    return (
      <div className="container page-details">
        <div className="info-container text-center">
          <h2>Vehicle Not Found</h2>
          <p>The requested vehicle does not exist or has been removed.</p>
          <Button btnAxn={() => navigate('/models')} label="Back to Models" color="dark" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container page-details">
        <div className="info-container text-center">
          <h2>Loading vehicle details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ backgroundImage: `url(${background})` }}>
      <div className="whiteCortain">
        <Gallery data={gallery} btnAxn={changeBG} />

        <div className="detailBox">
          <h2>{car.brand}</h2>
          <h1>{car.model}</h1>

          <p>{car.description}</p>

          <table className="detail-table">
            <tbody>
              <tr>
                <td>Year</td>
                <td className="text-end">{car.year}</td>
              </tr>
              <tr>
                <td>Power (CV)</td>
                <td className="text-end">{car.power}</td>
              </tr>
              <tr>
                <td>Max. Speed</td>
                <td className="text-end">{car.max_speed}</td>
              </tr>
              <tr>
                <td>0-100 km/h</td>
                <td className="text-end">{car.acceleration}</td>
              </tr>
              <tr>
                <td>Booking price</td>
                <td className="text-end">
                  {car.price}
                  {' '}
                  USD
                </td>
              </tr>
            </tbody>
          </table>

          <Button
            btnAxn={showBooking}
            iconStart="calendar"
            iconEnd="arrow"
            label="Booking"
            size="main"
          />
        </div>
      </div>

      <BackButton />
      <Booking
        vehicle={car.id}
        price={car.price}
        state={bookVisible}
        btnAxn={showBooking}
        close
      />
    </div>
  );
};

export default DetailScreen;
