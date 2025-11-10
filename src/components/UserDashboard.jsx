// src/components/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaArrowLeft, FaPlaneDeparture, FaCheckCircle, FaClock, FaListAlt, FaPaperPlane, FaUpload, FaTimes } from 'react-icons/fa';

// URL API Booking sudah didefinisikan (http://localhost:5000/api/booking/my-bookings)
const API_URL = 'http://localhost:5000/api/booking/my-bookings';
const API_UPLOAD_URL = 'http://localhost:5000/api/booking/upload-payment';

const UserDashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false); 
  const [currentBookingId, setCurrentBookingId] = useState(null); 
  const [paymentFile, setPaymentFile] = useState(null); // 🚀 GANTI DARI URL KE FILE
  const [uploadMessage, setUploadMessage] = useState('');
  
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setBookings(data.data);
        } else {
          console.error("Gagal memuat pesanan:", data.message);
        }
      } catch (error) {
        console.error("Koneksi gagal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };


  const handleUploadClick = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowUploadModal(true);
    setPaymentFile(null);
    setUploadMessage('');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!paymentFile) {
        setUploadMessage('Harap pilih file bukti pembayaran.');
        return;
    }

    const token = localStorage.getItem('token');
    setUploadMessage('Mengunggah...');

    const formData = new FormData();
    formData.append('bukti', paymentFile);
    
    try {
        const response = await fetch(`${API_UPLOAD_URL}/${currentBookingId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
            body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
            setUploadMessage('✅ Bukti berhasil diunggah!');
            setTimeout(() => {
                setShowUploadModal(false);
                window.location.reload(); 
            }, 1500);
        } else {
            setUploadMessage(data.message || 'Gagal mengunggah. Coba lagi.');
        }

    } catch (error) {
        setUploadMessage('Koneksi server gagal saat upload.');
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status_pembayaran === 'Pending').length;
  const confirmedBookings = totalBookings - pendingBookings;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="container mx-auto max-w-7xl">
        
        {/* === HEADER DASHBOARD & LOGOUT === */}
        <div className="flex justify-between items-center mb-10 border-b pb-4 bg-white p-4 rounded-xl shadow-lg">
          <h1 className="text-4xl font-oswald text-blue-600 uppercase flex items-center">
            <FaUserCircle className="mr-3 text-3xl" /> 
            Selamat Datang, {user.username}!
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* === TOMBOL KEMBALI & STATISTIK RINGKAS === */}
        <div className="mb-8 flex justify-between items-center">
            {/* 🚀 TOMBOL KEMBALI KE HOMEPAGE / BUAT PESANAN BARU */}
            <div className="flex space-x-4">
                <button onClick={() => navigate('/')} className="flex items-center bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-bold transition shadow-md">
            <FaArrowLeft className="mr-2" /> Kembali ke Halaman Utama
                </button>
                <button onClick={() => navigate('/booking')} className="flex items-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-bold transition shadow-md">
            <FaPaperPlane className="mr-2" /> Buat Pemesanan Baru
                </button>
             </div>

            {/* Ringkasan Statistik dalam Card */}
            <div className="grid grid-cols-3 gap-4 w-1/2">
                {/* Total */}
                <div className="bg-white p-4 rounded-lg shadow-lg text-center border-l-4 border-blue-500">
                    <p className="text-3xl font-bold text-blue-600 font-oswald">{totalBookings}</p>
                    <p className="text-sm text-gray-500">Total Pemesanan</p>
                </div>
                {/* Pending */}
                <div className="bg-white p-4 rounded-lg shadow-lg text-center border-l-4 border-yellow-500">
                    <p className="text-3xl font-bold text-yellow-600 font-oswald">{pendingBookings}</p>
                    <p className="text-sm text-gray-500">Menunggu Pembayaran</p>
                </div>
                {/* Confirm */}
                <div className="bg-white p-4 rounded-lg shadow-lg text-center border-l-4 border-green-500">
                    <p className="text-3xl font-bold text-green-600 font-oswald">{confirmedBookings}</p>
                    <p className="text-sm text-gray-500">Berhasil Dikonfirmasi</p>
                </div>
            </div>
        </div>
        /
        {/* === RIWAYAT PEMESANAN (LIST) === */}
        <h2 className="text-3xl font-oswald text-blue-600 mb-6 flex items-center">
            <FaListAlt className="mr-2" /> Riwayat Pemesanan Anda
        </h2>
        
        {loading ? (
            <div className="text-center py-10"><p className="text-gray-600">Memuat riwayat...</p></div>
        ) : bookings.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                <FaPlaneDeparture className="text-5xl text-gray-400 mx-auto mb-3" />
                <p className="text-xl text-gray-600 font-semibold">Anda belum memiliki riwayat pemesanan.</p>
                <p className="text-sm text-gray-500 mt-1">Saatnya rencanakan liburan Anda!</p>
            </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking.pemesanan_id} 
                className="p-5 border rounded-xl shadow-md bg-white flex justify-between items-center transition hover:shadow-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xl text-blue-600">{booking.nama_paket}</p>
                  <p className="text-sm text-gray-500 mt-1">Tanggal Perjalanan: {booking.tanggal_perjalanan}</p>
                </div>
                
                <div className="text-right flex items-center space-x-4">
                    <p className="text-2xl font-oswald font-extrabold text-green-700">Rp {Number(booking.total_harga).toLocaleString('id-ID')}</p>
                    {/* 🚀 TOMBOL UPLOAD HANYA JIKA PENDING */}
                {booking.status_pembayaran === 'Pending' && (
                <button
                    onClick={() => handleUploadClick(booking.pemesanan_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded-lg font-semibold transition flex items-center"
                >
                    <FaUpload className="mr-1" /> Upload Bukti
                </button>
                )}
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center ${
                        booking.status_pembayaran === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status_pembayaran === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {booking.status_pembayaran === 'Confirmed' && <FaCheckCircle className="mr-1" />}
                        {booking.status_pembayaran === 'Pending' && <FaClock className="mr-1" />}
                        {booking.status_pembayaran}
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    {/* 🚀 MODAL UPLOAD BUKTI PEMBAYARAN (Ditempatkan di luar div.container) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-2xl font-oswald text-blue-600">Unggah Bukti Pembayaran</h3>
                <button type="button" onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-800"><FaTimes /></button>
            </div>
            
            <p className="mb-4 text-gray-600 text-sm">Pemesanan ID: {currentBookingId}. Masukkan URL gambar bukti transfer Anda.</p>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pilih File Bukti Bayar</label>
                <input
                  type="file"
                  accept="image/jpeg, image/png" 
                  onChange={(e) => setPaymentFile(e.target.files[0])}
                  className="w-full p-2 border rounded-lg mt-1"
                  required
                />
                 {paymentFile && <p className="text-xs text-green-600 mt-1">File terpilih: {paymentFile.name}</p>}
              </div>

              {uploadMessage && (
                <div className={`p-2 text-sm rounded ${uploadMessage.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {uploadMessage}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center"
                >
                  <FaUpload className="mr-1" /> Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;