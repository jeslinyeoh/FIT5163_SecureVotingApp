import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RegistrationForm.css';
import axios from 'axios';


function RegistrationForm() {
  // const [values, setValues] = useState({
  //   firstName: '',
  //   lastName: '',
  //   dob: '',
  //   address: '',
  //   email: '',
  //   phoneNumber: '',
  //   taxFileNumber: '',
  //   publicKey: '',
  //   username: '',
  //   password: ''
  // })


  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    address: "",
    email: "",
    phoneNumber: "",
    taxFileNumber: "",
    publicKey: "", // Blockchain public key field
    username: "",  // New field for username
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // setValues({...values, [event.target.name]:event.target.value})
  };

  // Helper function to validate DOB (checking if user is at least 18 years old)
  const isLegalDOB = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  // Validation function
  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(\+61|0)[2-478](\d{8})$/;
    const tfnRegex = /^\d{8,9}$/;
    const publicKeyRegex = /^0x[a-fA-F0-9]{40}$/; // Ethereum public key regex
    let newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else if (isLegalDOB(formData.dob) < 18) {
      newErrors.dob = "You must be at least 18 years old";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid Email";
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid Australian phone number (e.g., +614XXXXXXXX)";
    }
    if (!tfnRegex.test(formData.taxFileNumber)) {
      newErrors.taxFileNumber = "Invalid Australian Tax File Number (TFN)";
    }
    if (!formData.username) {
      newErrors.username = "Username is required";  // Validation for username
    }
    if (!publicKeyRegex.test(formData.publicKey)) {
      newErrors.publicKey = "Invalid Blockchain Public Key";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/registrationForm',formData)
    .then(res => console.log("Registered Successfully!!"))
    .catch(err => console.log(err));
    navigate("/login");
  };

  // Handle registration button click
  const handleLoginClick = () => {
    navigate('/Login'); // Navigate to the login page
  };

  return (
    <div className="registration-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        {errors.lastName && <p className="error">{errors.lastName}</p>}
        <p>DOB:</p>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          required
        />
        
        {errors.dob && <p className="error">{errors.dob}</p>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number (e.g., +614XXXXXXXX)"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

        <input
          type="text"
          name="taxFileNumber"
          placeholder="Tax File Number (TFN)"
          value={formData.taxFileNumber}
          onChange={handleInputChange}
          required
        />
        {errors.taxFileNumber && <p className="error">{errors.taxFileNumber}</p>}

        <input
          type="text"
          name="publicKey"
          placeholder="Blockchain Public Key (e.g., 0x...)"
          value={formData.publicKey}
          onChange={handleInputChange}
          required
        />
        {errors.publicKey && <p className="error">{errors.publicKey}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}  {/* Error for username */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit">Register</button>
      </form>
      <button type="button" onClick={handleLoginClick}>
        Already have an account? Login
      </button>
    </div>
  );
}

export default RegistrationForm;
