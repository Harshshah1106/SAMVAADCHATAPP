import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../contexts/AuthContext';

function Profile() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.firstname + ' ' + user.lastname);
      setDescription(user.description || '');
    }
  }, [user]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  if (picture) {
    formData.append('picture', picture);
  }
  try {
    await apiClient.put('/profile', formData);
    await fetchUser();
    navigate('/chat');
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-white">Update Your Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-200" htmlFor="name">Name</label>
              <input type="text" placeholder="Name" id="name"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mt-4">
              <label className="block text-gray-200" htmlFor="description">Description</label>
              <textarea placeholder="Description" id="description"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-gray-200" htmlFor="picture">Profile Picture</label>
              <input type="file" id="picture"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 bg-gray-700 text-white"
                onChange={(e) => setPicture(e.target.files[0])} />
            </div>
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-purple-600 rounded-lg hover:bg-purple-900">Update Profile</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
