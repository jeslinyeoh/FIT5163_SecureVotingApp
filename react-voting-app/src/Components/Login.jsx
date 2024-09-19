import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"

const Login = (props) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Clear previous errors
    setErrors({});

    if (validateForm()) {
      // Send form data to the backend for authentication
      axios.post('http://localhost:8081/login', formData)
        .then(res => {
          if (res.data === "Success") {
            console.log("Login successful, navigating to homepage");
            props.connectToMetamask(); // Connect to MetaMask
            navigate('/'); // Navigate to the homepage after successful login
          } else {
            setErrors({ general: "Invalid username or password." });
          }
        })
        .catch(err => {
          console.error("Login error:", err);
          setErrors({ general: "An error occurred during login." });
        });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form inputs
  const validateForm = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?_@])[A-Za-z\d!?_]{8,}$/;
    const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/; // Adjusted to allow basic special characters and be 6 characters long

    let newErrors = {};

    if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Invalid Username";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Invalid Password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration button click
  const handleRegisterClick = () => {
    navigate('/registrationForm'); // Navigate to the registration page
  };

  return (
    <div className="login-container">
      <h2>Vote Now!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>} {/* Display username error */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>} {/* Display password error */}

        {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>} {/* Display general error */}

        <button type="submit">Login</button>
      </form>
      
      <button type="button" onClick={handleRegisterClick}>
        No Account? Register here
      </button>
    </div>
  );
};

export default Login;


