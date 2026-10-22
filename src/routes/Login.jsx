/* eslint linebreak-style: ["error", "windows"] */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/button/Button';
import './Login.scss';
import { API_URL } from '../config';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('current_user', JSON.stringify(userData));
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Invalid email or password.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container page-login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>LOGIN</h2>

        <div className="add-padding-below">
          {errorMessage && (
            <span className="error-message active">{errorMessage}</span>
          )}

          <input
            type="email"
            id="email"
            name="email"
            className="form-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="add-padding-below">
          <input
            type="password"
            id="password"
            name="password"
            className="form-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <p className="signin-message">
          Don&apos;t have an account yet?
          <Link to="/signup"> SIGN UP</Link>
        </p>

        <div className="form-bottom-bar">
          <Button
            type="submit"
            label={isLoading ? 'Logging in...' : 'Login'}
            size="main"
            color="dark"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
