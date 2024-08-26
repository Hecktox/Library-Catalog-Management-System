import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError("");
    try {
      await axios.post("http://localhost:8080/api/sign-up", {
        username,
        password,
        name,
      });
      alert("Sign Up Successful");
      navigate("/");
    } catch (error) {
      setError(error.response ? error.response.data : "Sign Up failed");
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <div className="signup-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="signup-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="signup-input"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="signup-input"
        />
        <button onClick={handleSignUp} className="signup-button">
          Sign Up
        </button>
        <button onClick={handleBackToLogin} className="back-to-login-button">
          Back to Login
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
