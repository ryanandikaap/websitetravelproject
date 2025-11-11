// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/auth/login';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 
        setLoading(true);
        let response; 

        try {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); 

            if (response.ok) { 
                setMessage('Login berhasil! Mengalihkan...');
                

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); 

                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        navigate('/admin/dashboard'); 
                    } else {
                        navigate('/dashboard'); 
                    }
                }, 1000); 
                
            } else { 
                setMessage(data.message || 'Login gagal. Cek email dan password Anda.');
            }
        } catch (error) {
            console.error('Error saat koneksi:', error);
            
            if (!response) {
                setMessage('KONEKSI GAGAL. Pastikan server Node.js dan MySQL berjalan.');
            } else {
                 setMessage('Terjadi kesalahan saat memproses data.');
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-6 font-oswald uppercase">
          Login Pelanggan
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
              placeholder="Masukkan alamat email Anda"
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
              placeholder="Masukkan password"
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
            {loading ? 'Memproses...' : 'LOGIN'}
          </button>
        </form>

        {/* 🚀 PERUBAHAN: Tambahkan link Forgot Password di atas link Daftar */}
        <p className="text-center text-sm mt-4 text-red-600">
          <a href="/forgot-password" className="text-red-500 hover:text-blue-600 hover:underline font-semibold">Lupa Password?</a>
        </p>
        
        <p className="text-center text-sm mt-4 text-gray-600">
          Belum punya akun? <a href="/register" className="text-amber-500 hover:underline font-semibold">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
