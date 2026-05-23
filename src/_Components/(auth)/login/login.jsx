import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../../utils/authService';
import { FiMail, FiLock, FiLogIn, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const usernameOrEmail = e.target.emailOrUsername.value;
    const password = e.target.password.value;
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await loginUser(usernameOrEmail, password);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message === "Failed to fetch"
        ? "Cannot connect to server. Please try again later."
        : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="glow-circle glow-circle-1"></div>
        <div className="glow-circle glow-circle-2"></div>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to manage your orders and listings</p>

        {errorMsg && (
          <div className="error-banner">
            <FiAlertCircle className="error-icon" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-field">
            <label htmlFor="emailOrUsername" className="auth-label">
              <FiMail /> Username or Email
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              placeholder="Enter username or email"
              className="auth-input"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="auth-label">
              <FiLock /> Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            <FiLogIn />
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;