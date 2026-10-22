/* eslint linebreak-style: ["error", "windows"] */
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/navbar/Navbar';
import AboutScreen from './routes/About';
import AdminScreen from './routes/admin/Admin';
import BookingScreen from './routes/Booking';
import DetailScreen from './routes/Detail';
import HomeScreen from './routes/Home';
import NewScreen from './routes/admin/New';
import ReservationScreen from './routes/Reservation';
import LoginScreen from './routes/Login';
import SignupScreen from './routes/Signup';
import ProtectedRoutes from './routes/ProtectedRoutes';
import { getVehicles } from './redux/vehicles/vehicles';
import { getReservations } from './redux/users/users';
import { getValidAuthSession } from './utils/auth';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const session = getValidAuthSession('current_user');

    // Always load vehicles catalog
    dispatch(getVehicles());

    // Only attempt to fetch user-specific reservations if an active session exists
    if (session && session.token) {
      dispatch(getReservations());
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route element={<LoginScreen />} path="/login" />
        <Route element={<SignupScreen />} path="/signup" />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route index element={<HomeScreen />} />
          <Route element={<HomeScreen />} path="/models" />
          <Route element={<DetailScreen />} path="/models/:id" />
          <Route element={<BookingScreen />} path="/booking" />
          <Route element={<ReservationScreen />} path="/reservation" />
          <Route element={<AboutScreen />} path="/about" />
          <Route element={<AdminScreen />} path="/admin" />
          <Route element={<NewScreen />} path="/admin/new" />
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={(
            <section className="flex-center">
              <div className="container text-center">
                <h2>404 - Page Not Found</h2>
              </div>
            </section>
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;
