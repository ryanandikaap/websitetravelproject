// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserShield, FaClipboardList, FaFileExcel, FaChartBar, 
  FaCheckCircle, FaClock, FaTimesCircle, FaSignOutAlt, FaPlus, FaBoxOpen, FaFileImage, FaWhatsapp
} from 'react-icons/fa';
import * as XLSX from 'xlsx'; 
import PackageForm from './PackageForms'; 
import GalleryManager from './GalleryManager';

const API_BOOKINGS_URL = 'http://localhost:5000/api/admin/bookings'; 
const API_PACKAGES_URL = 'http://localhost:5000/api/packages';

const AdminDashboard = ({ user }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [packages, setPackages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllContent = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
      
      const bookingRes = await fetch(API_BOOKINGS_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      const bookingData = await bookingRes.json();

      const packageRes = await fetch(API_PACKAGES_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      const packageData = await packageRes.json();

      if (bookingRes.ok && bookingData.success && packageRes.ok && packageData.success) {
        setAllBookings(bookingData.data);
        setPackages(packageData.data); 
      } else {
        if (bookingRes.status === 401 || bookingRes.status === 403) {
          alert("Sesi berakhir atau tidak memiliki hak akses Admin. Silakan login kembali.");
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Koneksi gagal saat fetch content:", error);
      alert("Gagal memuat data. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContent(); 
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Confirmed' : 'Pending';
    const token = localStorage.getItem('token');
    
    if (!window.confirm(`Yakin mengubah status Pemesanan ID ${id} menjadi ${newStatus}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Status berhasil diubah menjadi ${newStatus}`);
        fetchAllContent(); 
      } else {
        const errorData = await response.json();
        alert(`Gagal update status: ${errorData.message || 'Terjadi kesalahan.'}`);
      }
    } catch (error) {
      console.error("Error update status:", error);
      alert("done.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); 
  };

  //Download data ke Excel
  const downloadExcel = () => {
    const dataToExport = allBookings.map(booking => ({
      'ID Pemesanan': booking.pemesanan_id,
      'Nama User': booking.nama_user,
      'Email User': booking.email_user, 
      'Nomor Telepon User': booking.nomor_telepon_user, 
      'Nama Paket': booking.nama_paket,
      'Tanggal Perjalanan': booking.tanggal_perjalanan,
      'Jumlah Peserta': booking.jumlah_peserta, 
      'Total Harga': booking.total_harga,
      'Status Pembayaran': booking.status_pembayaran,
      'Tanggal Pemesanan': new Date(booking.tanggal_pemesanan).toLocaleDateString('id-ID'),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Pemesanan");
    XLSX.writeFile(wb, "Laporan_Pemesanan_Travel.xlsx");
  };

  const totalOrders = allBookings.length;
  const pendingOrders = allBookings.filter(b => b.status_pembayaran === 'Pending').length;
  const confirmedOrders = allBookings.filter(b => b.status_pembayaran === 'Confirmed').length;
  const cancelledOrders = allBookings.filter(b => b.status_pembayaran === 'Cancelled').length; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 p-8 font-sans">
      <div className="container mx-auto max-w-7xl">
        
        {/* === HEADER DASHBOARD & LOGOUT === */}
        <div className="flex justify-between items-center mb-10 border-b pb-4 border-purple-200 bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-4xl font-oswald text-purple-700 uppercase flex items-center">
            <FaUserShield className="mr-3 text-3xl text-purple-500" /> 
            Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition font-semibold flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>

        {/* === RINGKASAN STATISTIK === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex items-center justify-between">
            <div><p className="text-sm text-gray-500 font-medium">Total Pemesanan</p><p className="text-4xl font-bold text-blue-700 font-oswald mt-1">{totalOrders}</p></div>
            <FaClipboardList className="text-5xl text-blue-300 opacity-70" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 flex items-center justify-between">
            <div><p className="text-sm text-gray-500 font-medium">Menunggu Pembayaran</p><p className="text-4xl font-bold text-yellow-700 font-oswald mt-1">{pendingOrders}</p></div>
            <FaClock className="text-5xl text-yellow-300 opacity-70" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 flex items-center justify-between">
            <div><p className="text-sm text-gray-500 font-medium">Terkonfirmasi</p><p className="text-4xl font-bold text-green-700 font-oswald mt-1">{confirmedOrders}</p></div>
            <FaCheckCircle className="text-5xl text-green-300 opacity-70" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 flex items-center justify-between">
            <div><p className="text-sm text-gray-500 font-medium">Dibatalkan</p><p className="text-4xl font-bold text-red-700 font-oswald mt-1">{cancelledOrders}</p></div>
            <FaTimesCircle className="text-5xl text-red-300 opacity-70" />
          </div>
        </div>

        {/* === LAYOUT UTAMA: MANAJEMEN KONTEN & LAPORAN (GRID 3 KOLOM) === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          
          {/* KOLOM KIRI (1/3): FORM TAMBAH PAKET */}
          <div className="lg:col-span-1">
            <PackageForm onPackageAdded={fetchAllContent} />
          <div className="mt-6"> 
            <GalleryManager onPhotoChange={fetchAllContent} />
          
            
            {/* Daftar Paket Saat Ini (Tampilan Ringkas) */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-6 border-l-4 border-amber-500">
                <h3 className="text-xl font-oswald text-amber-600 flex items-center"><FaBoxOpen className="mr-2" /> Paket Tersedia ({packages.length})</h3>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {packages.slice(0, 5).map(pkg => (
                        <li key={pkg.id} className="truncate">{pkg.nama}</li>
                    ))}
                    {packages.length > 5 && <li>... dan {packages.length - 5} lainnya</li>}
                </ul>
            </div>
          </div>
          </div>
          
          {/* KOLOM KANAN (2/3): LAPORAN PEMESANAN MASUK */}
          <div className="lg:col-span-2">
            
            {/* Judul Laporan & Tombol Download Excel */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-oswald text-purple-700 flex items-center">
                    <FaChartBar className="mr-2 text-purple-500" /> Laporan Pemesanan Masuk
                </h2>
                <button
                    onClick={downloadExcel}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-bold transition shadow-md flex items-center"
                >
                    <FaFileExcel className="mr-2" /> Unduh Laporan (Excel)
                </button>
            </div>
            
           {/* Tabel Pemesanan */}
            {loading ? (
                <div className="text-center py-10 bg-white rounded-xl shadow-md"><p className="text-gray-600 text-lg">Memuat data pesanan...</p></div>
            ) : allBookings.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
                    <FaClipboardList className="text-5xl text-gray-400 mx-auto mb-3" />
                    <p className="text-xl text-gray-600 font-semibold">Belum ada pemesanan yang masuk.</p>
                </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">User</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Email User</th>
                      {/* --- PENAMBAHAN HEADER NO. WA --- */}
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">No. WA User</th>
                      {/* -------------------------------- */}
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Paket</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Tgl Perjalanan</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Jumlah</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Total Harga</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Aksi</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Bukti Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allBookings.map((booking) => (
                      <tr key={booking.pemesanan_id} className="hover:bg-purple-50 transition duration-150 ease-in-out">
                        <td className="py-3 px-4 text-sm text-gray-800">{booking.pemesanan_id}</td>
                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{booking.nama_user}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{booking.email_user}</td>
                        
                        {/* --- PERBAIKAN: Menggunakan booking.nomor_telepon_user --- */}
                        {/* --- PERBAIKAN: Menggunakan booking.nomor_telepon_user --- */}
                        <td className="py-3 px-4 text-sm text-gray-600">
                            {booking.nomor_telepon_user ? ( // Properti diperbaiki di sini
                                <a 
                                    href={`https://wa.me/${booking.nomor_telepon_user}`} // Properti diperbaiki di sini
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 flex items-center font-medium"
                                >
                                    {/* Anda harus mengimpor FaWhatsapp di bagian atas file */}
                                    <FaWhatsapp className="mr-1 text-base" />
                                    {booking.nomor_telepon_user} // Properti diperbaiki di sini
                                </a>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </td>
                        {/* -------------------------------- */}
                        
                        <td className="py-3 px-4 text-sm text-gray-800">{booking.nama_paket}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{booking.tanggal_perjalanan}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{booking.jumlah_peserta}</td>
                        <td className="py-3 px-4 text-sm text-green-700 font-bold">Rp {Number(booking.total_harga).toLocaleString('id-ID')}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                            booking.status_pembayaran === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status_pembayaran === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800' 
                          }`}>
                            {booking.status_pembayaran === 'Confirmed' && <FaCheckCircle className="mr-1" />}
                            {booking.status_pembayaran === 'Pending' && <FaClock className="mr-1" />}
                            {booking.status_pembayaran === 'Cancelled' && <FaTimesCircle className="mr-1" />}
                            {booking.status_pembayaran}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleUpdateStatus(booking.pemesanan_id, booking.status_pembayaran)}
                            className={`py-1 px-3 text-xs font-semibold rounded-md transition ${
                              booking.status_pembayaran === 'Confirmed' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 
                              'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {booking.status_pembayaran === 'Confirmed' ? 'Set Pending' : 'Set Confirmed'}
                          </button>
                        </td>
                        {/* 🚀 KOLOM BUKTI PEMBAYARAN */}
                        <td className="py-3 px-4 text-center">
                          {booking.bukti_bayar_url ? (
                            <a 
                              href={`http://localhost:5000${booking.bukti_bayar_url}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 font-semibold text-sm flex items-center justify-center"
                            >
                              <FaFileImage className='mr-1' /> Lihat
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;