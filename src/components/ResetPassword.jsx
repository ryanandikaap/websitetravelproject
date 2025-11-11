// src/components/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaKey, FaLock, FaCheckCircle } from 'react-icons/fa';

const API_RESET_URL = 'http://localhost:5000/api/auth/reset-password';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const initialEmail = location.state?.userEmail || '';

    const [email, setEmail] = useState(initialEmail);
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (!email || !resetCode || !newPassword) {
            setMessage('Semua field wajib diisi.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_RESET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resetCode, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('✅ Password berhasil direset! Anda akan diarahkan ke Login.');
                setTimeout(() => navigate('/login'), 2500);
            } else {
                setMessage(data.message || 'Reset gagal. Cek kode atau coba lagi.');
            }
        } catch (error) {
            console.error('Reset error:', error);
            setMessage('Terjadi kesalahan koneksi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6 font-oswald uppercase">
                    Reset Password
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
                            Email Terdaftar
                        </label>
                        <input type="email" value={email} readOnly 
                               className="w-full p-3 border bg-gray-100 rounded-lg" />
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
                            <FaKey className="mr-2" /> Kode Reset (Cek Terminal Node.js Anda)
                        </label>
                        <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)}
                               placeholder="Masukkan 6 digit kode OTP" maxLength="6"
                               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
                            <FaLock className="mr-2" /> Password Baru
                        </label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                               placeholder="Buat password baru"
                               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
                    </div>

                    {message && (
                        <div className={`text-center p-3 rounded-lg ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-bold ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                        {loading ? 'Mereset...' : <span><FaCheckCircle className="mr-2" /> RESET PASSWORD</span>}
                    </button>
                </form>
                
                <p className="text-center text-sm mt-4 text-gray-600">
                    <a onClick={() => navigate('/login')} className="text-blue-600 hover:underline cursor-pointer font-semibold">Kembali ke Login</a>
                </p>
                
            </div>
        </div>
    );
};

export default ResetPassword;