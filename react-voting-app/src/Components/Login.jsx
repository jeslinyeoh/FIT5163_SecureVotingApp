import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"

const Login = (props) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login',formData)
    .then(res => {
      if(res.data === "Success"){
        props.connectToMetamask();
      } else{
        alert("No record exists")
      }
    })
    .catch(err => console.log(err));
    
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
    const { username, password } = formData;
    return username.trim() !== '' && password.trim() !== '';
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      
      <button type="button" onClick={handleRegisterClick}>
        No Account? Register here
      </button>
    </div>
  );
};

export default Login;