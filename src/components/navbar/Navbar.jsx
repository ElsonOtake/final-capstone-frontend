/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-script-url */
/* eslint linebreak-style: ["error", "windows"] */
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaMedium,
  FaGithub,
  FaLinkedinIn,
  FaAngellist,
  FaTimes,
} from 'react-icons/fa';
import './Navbar.scss';
import Button from '../button/Button';
import { getValidAuthSession, clearAuthSession } from '../../utils/auth';

const Navbar = () => {
  const location = useLocation();
  const [navVisible, setNavVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Re-check authentication state on location (route) changes
  useEffect(() => {
    if (window.innerWidth < 400) {
      setNavVisible(false);
    }

    const session = getValidAuthSession('current_user');

    if (session && session.token) {
      setIsLoggedIn(true);
      setIsAdmin(session.role === 'admin');
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [location]);

  const closeNav = () => setNavVisible(false);

  const endSession = () => {
    clearAuthSession('current_user', '/login');
  };

  return (
    <>
      <div className="menuMobile" onClick={() => setNavVisible(!navVisible)}>
        <FaBars className="icon" />
      </div>
      <div className={navVisible ? 'navbar nav-show' : 'navbar nav-hide'}>
        <div className="closeBtn" onClick={closeNav}>
          <FaTimes className="icon" />
        </div>

        <div className="navTop">
          <Link to="/" className="img-container" onClick={closeNav} />

          <nav>
            <ul>
              <li>
                <NavLink to="/models" onClick={closeNav}>
                  MODELS
                </NavLink>
              </li>
              <li>
                <NavLink to="/reservation" onClick={closeNav}>
                  RESERVATIONS
                </NavLink>
              </li>
              <li>
                <NavLink to="/booking" onClick={closeNav}>
                  BOOKING
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={closeNav}>
                  ABOUT
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to="/admin" onClick={closeNav}>
                    ADMIN
                  </NavLink>
                </li>
              )}
              {isLoggedIn && (
                <li className="logout-button">
                  <Button
                    label="LOGOUT"
                    size="normal"
                    color="dark"
                    btnAxn={endSession}
                  />
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="social-icons">
          <ul>
            <li>
              <a
                href="https://github.com/ElsonOtake/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FaGithub className="icon" />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/elsonotake"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="icon" />
              </a>
            </li>
            <li>
              <a
                href="https://wellfound.com/u/elsonotake"
                target="_blank"
                rel="noreferrer"
                aria-label="Wellfound"
              >
                <FaAngellist className="icon" />
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@elsonotake"
                target="_blank"
                rel="noreferrer"
                aria-label="Medium"
              >
                <FaMedium className="icon" />
              </a>
            </li>
          </ul>

          <p>Microverse Copyright 2022</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
