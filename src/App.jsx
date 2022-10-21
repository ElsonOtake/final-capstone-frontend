/* eslint linebreak-style: ["error", "windows"] */
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import AboutScreen from './routes/About';
import BookingScreen from './routes/Booking';
import DetailScreen from './routes/Detail';
import HomeScreen from './routes/Home';
import ReservationScreen from './routes/Reservation';
import LoginScreen from './routes/Login';
import SignupScreen from './routes/Signup';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<LoginScreen />} path="/login" />
        <Route element={<SignupScreen />} path="/signup" />
        <Route element={<AboutScreen />} path="/about" />
        <Route element={<BookingScreen />} path="/booking" />
        <Route element={<DetailScreen />} path="/detail/:id" />
        <Route element={<ReservationScreen />} path="/reservation" />
        <Route index element={<HomeScreen />} />
        <Route
          element={
            <section className="flex-center"><div className="container text-center">404 Page not found</div></section>
          }
          path="*"
        />
      </Routes>
    </Router>
  );
}

export default App;
