/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint linebreak-style: ["error", "windows"] */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/button/Button';
import './Login.scss';
import { API_URL } from '../config';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const signupPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      // 1. Create User
      const signupResponse = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json().catch(() => ({}));
        setErrorMessage(
          errorData.message || 'Signup failed. Email may already exist or password is too weak.',
        );
        setIsSubmitting(false);
        return;
      }

      // 2. Automatically Log In
      const loginPayload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const loginResponse = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
      });

      if (loginResponse.ok) {
        const userData = await loginResponse.json();
        localStorage.setItem('current_user', JSON.stringify(userData));
        navigate('/models');
      } else {
        setErrorMessage('Account created, but automatic login failed. Please log in manually.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-login">
      <form className="login-form" onSubmit={handleSignup}>
        <h2>SIGNUP</h2>

        {errorMessage && (
          <div className="add-padding-below">
            <span className="error-message active">{errorMessage}</span>
          </div>
        )}

        <div className="add-padding-below">
          <label htmlFor="name" className="visually-hidden">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-field"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="add-padding-below">
          <label htmlFor="email" className="visually-hidden">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-field"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="add-padding-below">
          <label htmlFor="password" className="visually-hidden">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-field"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <p className="signin-message">
          Already have an account?
          {' '}
          <Link to="/login">LOGIN</Link>
        </p>

        <div className="form-bottom-bar">
          <Button
            type="submit"
            label={isSubmitting ? 'Signing up...' : 'Signup'}
            size="main"
            color="dark"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
