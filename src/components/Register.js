import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        username,
        email,
        password,
        phone_number: phoneNumber,
        firstname: firstName,
        lastname: lastName
      });
      // Navigation is handled in the AuthContext after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Registration failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-white">Register a new account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-200" htmlFor="username">Username</label>
              <input type="text" placeholder="Username" id="username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mt-4">
              <label className="block text-gray-200" htmlFor="email">Email</label>
              <input type="email" placeholder="Email" id="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-4">
              <label className="block text-gray-200" htmlFor="password">Password</label>
              <input type="password" placeholder="Password" id="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mt-4">
              <label className="block text-gray-200" htmlFor="phoneNumber">Phone Number</label>
              <input type="tel" placeholder="Phone Number" id="phoneNumber"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="mt-4">
              <label className="block text-gray-200" htmlFor="firstName">First Name</label>
              <input type="text" placeholder="First Name" id="firstName"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="mt-4">
              <label className="block text-gray-200" htmlFor="lastName">Last Name</label>
              <input type="text" placeholder="Last Name" id="lastName"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-purple-600 rounded-lg hover:bg-purple-900">Register</button>
              <Link to="/login" className="text-sm text-purple-600 hover:underline">Already have an account? Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

