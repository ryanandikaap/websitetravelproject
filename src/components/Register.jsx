// src/components/Register.jsx
import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/auth/register';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Pendaftaran berhasil! Anda akan dialihkan ke halaman Login...');
        setTimeout(() => {
            window.location.href = '/login'; 
        }, 2000);

      } else {
        setMessage(data.message || 'Pendaftaran gagal. Coba lagi.');
      }
    } catch (error) {
      console.error('Error saat koneksi:', error);
      setMessage('Terjadi kesalahan saat mencoba koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-6 font-oswald uppercase">
          Daftar Akun Baru
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div>
            <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
              <FaUser className="mr-2" /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Pilih nama pengguna"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
              <FaEnvelope className="mr-2" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Masukkan email aktif"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
              <FaLock className="mr-2" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Buat password"
              required
            />
          </div>

          {/* Pesan Status */}
          {message && (
            <div className={`text-center p-3 rounded-lg ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Mendaftarkan...' : 'DAFTAR'}
          </button>
        </form>
        
        <p className="text-center text-sm mt-4 text-gray-600">
          Sudah punya akun? <a href="/login" className="text-amber-500 hover:underline font-semibold">Login di sini</a>
        </p>
      </div>
    </div>
  );
};

export default Register;