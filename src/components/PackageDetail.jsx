// src/components/PackageDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaUsers } from 'react-icons/fa';
import BookingForm from './BookingForm'; 

const API_PACKAGES_URL = 'http://localhost:5000/api/packages'; 

const PackageDetail = () => {
    const { packageId } = useParams();
    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    let user = null;
    try {
        const userString = localStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString);
        }
    } catch (e) {
        console.error("Gagal parsing user data dari Local Storage:", e);
    } 

    useEffect(() => {
        const fetchPackageDetail = async () => {
            try {
                const response = await fetch(`${API_PACKAGES_URL}/${packageId}`); 
                
                if (response.status === 404) {
                    alert("Paket tidak ditemukan.");
                    return navigate('/'); 
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();

                if (data.success && data.data) {
                    setPackageData(data.data);
                } else {
                    alert("Terjadi kesalahan saat memuat data paket.");
                    navigate('/');
                }
            } catch (error) {
                console.error("Gagal fetch detail paket:", error);
                alert("Gagal koneksi ke server saat memuat detail.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchPackageDetail();
    }, [packageId, navigate]);

    if (loading) {
        return <div className="text-center py-20 text-xl font-oswald">Memuat detail paket...</div>;
    }

    if (!packageData || !packageData.id) { 
        return (
            <div className="text-center py-20">
                <p className='text-red-600 mb-4'>Paket tidak ditemukan. Silakan cek ID di URL.</p>
                <button onClick={() => navigate('/')} className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    const { id, nama, deskripsi, lokasi, harga, durasi, gambar_url } = packageData;

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 font-sans">
            <button 
                onClick={() => navigate('/')} 
                className="text-blue-600 hover:text-blue-800 mb-6 flex items-center transition duration-200"
            >
                &larr; Kembali ke Daftar Paket
            </button>

            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                
                {/* BAGIAN GAMBAR & NAMA PAKET */}
                <div className="relative h-96">
                    <img 
                        src={gambar_url || 'https://via.placeholder.com/1000x400?text=Gambar+Paket+Tidak+Tersedia'} 
                        alt={nama} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-8">
                        <h1 className="text-5xl font-extrabold text-white leading-tight">{nama}</h1>
                    </div>
                </div>

                {/* BAGIAN DETAIL & BOOKING */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    
                    {/* KOLOM KIRI: DESKRIPSI PAKET */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Detail Destinasi</h2>
                        
                        <div className="space-y-4 mb-6 text-gray-700">
                            <p className="flex items-center text-lg"><FaMapMarkerAlt className="mr-3 text-blue-500" /> **Lokasi:** {lokasi}</p>
                            {/* Durasi sudah diperbaiki agar tidak menambahkan "Hari" */}
                            <p className="flex items-center text-lg"><FaCalendarAlt className="mr-3 text-blue-500" /> **Durasi:** {durasi}</p> 
                            <p className="flex items-center text-lg"><FaDollarSign className="mr-3 text-blue-500" /> **Harga Mulai:** <span className="text-2xl font-extrabold text-green-600 ml-2">Rp {Number(harga || 0).toLocaleString('id-ID')}</span></p>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Deskripsi Lengkap</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{deskripsi}</p>
                    </div>

                    {/* KOLOM KANAN: FITUR BOOKING */}
                    <div className="lg:col-span-1">
                        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-lg sticky top-8">
                            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                                <FaUsers className="mr-2" /> Pesan Sekarang
                            </h2>
                            
                            {/* Menampilkan Form Booking hanya jika user login */}
                            {user ? (
                                <BookingForm packageInfo={packageData} user={{ id: user.id, role: user.role }} />
                            ) : (
                                <div className="text-center p-4 border rounded-lg bg-yellow-100 text-yellow-800">
                                    <p className="font-semibold mb-2">Anda harus Login untuk melakukan pemesanan.</p>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Login / Daftar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;