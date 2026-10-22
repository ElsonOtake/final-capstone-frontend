/* eslint linebreak-style: ["error", "windows"] */
import React, { useState } from 'react';
import Button from '../components/button/Button';
import Booking from '../components/booking/Booking';

const BookingScreen = () => {
  const [bookVisible, setBookVisible] = useState(false);

  const toggleBookingModal = () => {
    setBookVisible((prevState) => !prevState);
  };

  return (
    <div className="container page-booking">
      <p>
        Thank you for being interested in renting one of our exclusive vehicles that we have
        for you at EXO Cars. It is important to consider the following before continuing with
        your reservation:
      </p>
      <p>
        It is essential to have a valid driver&apos;s license at all times of the rental. If you
        are a foreigner, you must have a valid international driver&apos;s license.
      </p>
      <p>
        For any rental, you must make the reservation at least 48 hours in advance.
      </p>
      <p>
        For any cancellation, you can contact us to learn about our cancellation policies.
      </p>

      <Button
        btnAxn={toggleBookingModal}
        color="dark"
        iconStart="calendar"
        iconEnd="arrow"
        label="Booking"
        size="main"
      />

      <Booking
        state={bookVisible}
        btnAxn={toggleBookingModal}
        close
      />
    </div>
  );
};

export default BookingScreen;
