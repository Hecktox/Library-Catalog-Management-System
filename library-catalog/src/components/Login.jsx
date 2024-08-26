import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });
      setUser(response.data);
    } catch (error) {
      setError(error.response ? error.response.data : 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <div className="login-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Login</button>
        {error && <p className="error-message">{error}</p>}
        <div className="login-signup">
          <p>Don&apos;t have an account?</p>
          <Link to="/signup" className="signup-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
