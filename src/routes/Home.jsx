/* eslint-disable react/jsx-props-no-spreading */
/* eslint linebreak-style: ["error", "windows"] */
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import CircleLoader from 'react-spinners/ClipLoader';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.scss';
import CarCard from '../components/carCard/CarCard';
import { getVehicles } from '../redux/vehicles/vehicles';
import { getReservations } from '../redux/users/users';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const Home = () => {
  const dispatch = useDispatch();

  // Guard against non-array Redux slice structures
  const vehiclesState = useSelector((state) => state.vehicles);
  const vehiclesList = useMemo(() => {
    if (Array.isArray(vehiclesState)) return vehiclesState;
    if (Array.isArray(vehiclesState?.items)) return vehiclesState.items;
    return [];
  }, [vehiclesState]);

  useEffect(() => {
    dispatch(getReservations());
    dispatch(getVehicles());
  }, [dispatch]);

  const settings = {
    className: 'center',
    infinite: vehiclesList.length > 1,
    dots: true,
    speed: 500,
    slidesToShow: Math.min(3, vehiclesList.length || 1),
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 870,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
    ],
  };

  return (
    <div className="container">
      <div className="home-container">
        <header className="cars-header">
          <h1>LATEST MODELS</h1>
          <p>Please select a car</p>
          <hr className="division-span" />
        </header>

        <div className="cars-container">
          {vehiclesList.length === 0 ? (
            <div className="text-center add-margin-below">
              <CircleLoader color="#ffb400" size={60} />
              <p>Loading models...</p>
            </div>
          ) : (
            <div className="car-slider">
              <Slider {...settings}>
                {vehiclesList.map((car) => {
                  const imageUrl = car.galleries?.[0]?.photo || car.image || DEFAULT_IMAGE;

                  return (
                    <CarCard
                      key={car.id}
                      brand={car.brand}
                      model={car.model}
                      description={car.description}
                      image={imageUrl}
                      id={car.id}
                    />
                  );
                })}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
