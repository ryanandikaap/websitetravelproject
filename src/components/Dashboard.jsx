// src/components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard'; 
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    return null; 
  }

  let user;
  try {
    user = JSON.parse(userString);
  } catch (e) {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    return null;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} />;
  } else if (user.role === 'client') {
    return <UserDashboard user={user} />;
  } else {
    navigate('/login');
    return null;
  }
};

export default Dashboard;