// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import Login from './components/Login';       
import Register from './components/Register';   
import Dashboard from './components/Dashboard'; 
import AdminDashboard from './components/AdminDashboard';
import MainLayout from './components/MainLayout';
import BookingForm from './components/BookingForm'; 
import PackageDetail from './components/PackageDetail';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword'; 
import PaymentConfirmation from './components/PaymentConfirmation';
import PhotoGallery from './components/PhotoGallery';          

const ProtectedLayout = ({ element: Element }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login'; 
        return null;
    }
    return <Element />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<MainLayout />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/package/:packageId" element={<PackageDetail />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment-confirm" element={<PaymentConfirmation />} />
        <Route path="/photo" element={<PhotoGallery />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;