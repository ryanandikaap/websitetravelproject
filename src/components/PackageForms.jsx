// src/components/PackageForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDollarSign, FaMapMarkerAlt, FaFileImage } from 'react-icons/fa';

const API_CREATE_URL = 'http://localhost:5000/api/admin/packages';

const PackageForm = ({ onPackageAdded }) => {
    const [formData, setFormData] = useState({
        nama: '', lokasi: '', deskripsi: '', durasi: '', harga: '', gambar_url: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const token = localStorage.getItem('token');
    

    const formDataPayload = new FormData();
    formDataPayload.append('nama', formData.nama);
    formDataPayload.append('lokasi', formData.lokasi);
    formDataPayload.append('deskripsi', formData.deskripsi);
    formDataPayload.append('durasi', formData.durasi);
    formDataPayload.append('harga', formData.harga);
    formDataPayload.append('gambar_url', formData.gambar_url);
    
    if (!token) {
        setMessage('Akses ditolak. Silakan login Admin.');
        setLoading(false);
        return;
    }

    try {
        const response = await fetch(API_CREATE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
            body: formDataPayload,
        });

        const data = await response.json();

        if (response.ok && data.success) {
            setMessage('✅ Paket berhasil ditambahkan!');
            setFormData({ nama: '', lokasi: '', deskripsi: '', durasi: '', harga: '', gambar_url: '' });
            if (onPackageAdded) onPackageAdded(); 
        } else {
            setMessage(data.message || 'Gagal menambahkan paket. Pastikan Anda Admin.');
        }
    } catch (error) {
        console.error('Error saat submit paket:', error);
        setMessage('Terjadi kesalahan koneksi ke server.');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-purple-500">
            <h3 className="text-2xl font-oswald text-purple-700 mb-4 flex items-center border-b pb-2">
                <FaPlus className="mr-2" /> Tambah Paket Baru
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama Paket Wisata (Wajib)" required className="w-full p-2 border rounded" />
                <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} placeholder="Lokasi (Jawa/Bali/Lombok) (Wajib)" required className="w-full p-2 border rounded" />
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} placeholder="Deskripsi Singkat" rows="3" className="w-full p-2 border rounded"></textarea>
                <input type="text" name="durasi" value={formData.durasi} onChange={handleChange} placeholder="Durasi (e.g., 3 Hari 2 Malam)" className="w-full p-2 border rounded" />
                <input type="number" name="harga" value={formData.harga} onChange={handleChange} placeholder="Harga (Wajib)" required className="w-full p-2 border rounded" />
                <input type="text" name="gambar_url" value={formData.gambar_url} onChange={handleChange} placeholder="URL Gambar (/nama-file.jpg)" className="w-full p-2 border rounded" />
                
                {message && (
                    <div className={`p-2 rounded text-center ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition flex items-center justify-center">
                    {loading ? 'Menyimpan...' : <span><FaPlus className="mr-2" /> Tambahkan Paket</span>}
                </button>
            </form>
        </div>
    );
};

export default PackageForm;