// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const API_REQUEST_URL = 'http://localhost:5000/api/auth/request-reset';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(API_REQUEST_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) { 
                setMessage('✅ Kode reset password telah dikirim. Anda akan diarahkan ke halaman Reset...');
                setTimeout(() => {
                    navigate('/reset-password', { state: { userEmail: email } });
                }, 3000);
            } else {
                const data = await response.json();
                setMessage(data.message || 'Gagal meminta kode reset.');
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6 font-oswald uppercase">
                    Lupa Password
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Masukkan email Anda, kami akan mengirimkan instruksi untuk me-reset password.
                </p>
                
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="Alamat email terdaftar"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`text-center p-3 rounded-lg ${message.includes('berhasil') || message.includes('dikirim') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center ${loading ? 'bg-gray-400' : 'bg-amber-500 hover:bg-amber-600'}`}
                    >
                        {loading ? 'Mengirim...' : <span><FaPaperPlane className="mr-2" /> KIRIM INSTRUKSI</span>}
                    </button>
                </form>
                
                <p className="text-center text-sm mt-4 text-gray-600">
                    <a onClick={() => navigate('/login')} className="text-blue-600 hover:underline cursor-pointer font-semibold">Kembali ke Login</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;