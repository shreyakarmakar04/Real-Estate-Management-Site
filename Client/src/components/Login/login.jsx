import React, { useState, useEffect } from 'react';
import './login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const loginUser = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', {
        EmailID: loginEmail.trim(), // ✅ Trim input
        Password: loginPassword.trim()
      });

      if (response.data.success) {
        console.log('✅ Login success');
        navigate('/dashboard'); // ✅ Redirect to dashboard
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={loginUser}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email ID"
            required
            autoFocus
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <FaEnvelope className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="register-link">
          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;