// src/components/BookingForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaPaperPlane } from 'react-icons/fa';

const API_BOOKING_URL = 'http://localhost:5000/api/booking/create';

const BookingForm = ({ packageInfo, user }) => {
    
    if (!packageInfo || !user) {
        // Tampilkan pesan error jika user belum login/data paket tidak ada
        return <div className="text-center text-red-600 p-4 font-semibold bg-red-100 rounded-lg">Error: Sesi berakhir atau data paket tidak valid.</div>;
    }
    
    const basePrice = parseFloat(packageInfo.harga) || 0; 

    const [travelDate, setTravelDate] = useState('');
    const [numPeople, setNumPeople] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Hitung total harga
    const totalHarga = basePrice * numPeople;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        const bookingData = {
            user_id: user.id, 
            paket_id: packageInfo.id, 
            tanggal_perjalanan: travelDate,
            jumlah_orang: parseInt(numPeople),
            total_harga: totalHarga.toFixed(2),
        };
        
        try {
            const response = await fetch(API_BOOKING_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage('✅ Pemesanan berhasil! Anda akan diarahkan ke Dashboard.');
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setMessage(data.message || 'Pemesanan gagal. Cek data dan coba lagi.');
            }
        } catch (error) {
            console.error('Error saat pemesanan:', error);
            setMessage('Terjadi kesalahan koneksi saat memproses pemesanan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Form Pemesanan Paket</h3>
            
            {/* Tanggal Perjalanan */}
            <div>
                <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
                    <FaCalendarAlt className="mr-2" /> Tanggal Keberangkatan
                </label>
                <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                />
            </div>

            {/* Jumlah Orang */}
            <div>
                <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
                    <FaUsers className="mr-2" /> Jumlah Peserta
                </label>
                <input
                    type="number"
                    value={numPeople}
                    onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                />
            </div>

            {/* Total Harga */}
            <div className='border-t pt-3'>
                <label className="text-gray-700 text-sm font-semibold flex items-center mb-1">
                    <FaMoneyBillWave className="mr-2 text-green-600" /> Total Biaya
                </label>
                <p className="text-2xl font-oswald text-green-700 font-extrabold">
                    Rp {Number(totalHarga).toLocaleString('id-ID')}
                </p>
            </div>
            
            {/* Pesan Status */}
            {message && (
                <div className={`p-2 rounded text-center text-sm ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Tombol Submit */}
            <button
                type="submit"
                disabled={isSubmitting || !travelDate}
                className={`w-full py-2 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center ${isSubmitting || !travelDate ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isSubmitting ? 'Memproses Pesanan...' : <span><FaPaperPlane className="mr-2" /> PESAN SEKARANG</span>}
            </button>
        </form>
    );
};

export default BookingForm;