import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false); // Fix for SSR hydration issue

  useEffect(() => {
    setIsClient(true);
    console.log('Client-only logic here'); // Runs only on the client side
  }, []);

  const createUser = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Entered passwords are not the same');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        EmailID: emailID,
        Password: password,
      });

      console.log('✅ User created:', response.data);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('User with this email already exists');
      } else {
        setError(err.response?.data?.message || 'Failed to create user');
      }
      console.error('❌ Error creating user:', err);
    }
  };

  if (!isClient) {
    return null; // Avoid rendering mismatched SSR content
  }

  return (
    <div className="wrapper">
      <form onSubmit={createUser}>
        <h1>Register</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email ID"
            value={emailID}
            onChange={(event) => setEmailID(event.target.value)}
            required
          />
          <FaEnvelope className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Confirm</button>
        <div className="register-link">
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;