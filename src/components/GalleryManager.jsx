// src/components/GalleryManager.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrashAlt, FaSpinner, FaCloudUploadAlt, FaFileImage } from 'react-icons/fa';

const API_GALLERY_URL = 'http://localhost:5000/api/admin/gallery';

const GalleryManager = ({ onPhotoChange }) => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [galleryData, setGalleryData] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    const token = localStorage.getItem('token');

    // 1. Fetch Data Galeri
    const fetchGallery = async () => {
        setIsFetching(true);
        try {
            const response = await fetch(API_GALLERY_URL, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setGalleryData(data.data);
                if (onPhotoChange) onPhotoChange(); // Refresh parent (AdminDashboard)
            }
        } catch (error) {
            console.error("Gagal fetch galeri:", error);
        } finally {
            setIsFetching(false);
        }
    };
    
    useEffect(() => {
        fetchGallery();
    }, []);

    // 2. Handle Submit (Upload Foto Baru)
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file || !caption) {
            setMessage('Harap pilih file dan isi caption.');
            return;
        }

        setLoading(true);
        setMessage('Mengunggah file...');
        const formData = new FormData();
        formData.append('gambar', file); // Field name harus 'gambar' sesuai Multer
        formData.append('caption', caption);
        formData.append('description', description);

        try {
            const response = await fetch(API_GALLERY_URL, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage('✅ Foto berhasil ditambahkan!');
                // Reset form
                setFile(null); setCaption(''); setDescription('');
                fetchGallery(); // Muat ulang daftar
            } else {
                setMessage(data.message || 'Gagal menambahkan foto. Pastikan Anda Admin.');
            }
        } catch (error) {
            setMessage('Koneksi gagal saat upload.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle Delete (Hapus Foto)
    const handleDelete = async (fotoId) => {
        if (!window.confirm("Yakin ingin menghapus foto ini? File fisik juga akan dihapus.")) return;

        try {
            const response = await fetch(`${API_GALLERY_URL}/${fotoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setMessage('Foto berhasil dihapus!');
                fetchGallery();
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Gagal menghapus foto.');
            }
        } catch (error) {
            setMessage('Koneksi gagal saat menghapus.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-purple-500">
            <h3 className="text-2xl font-oswald text-purple-700 mb-4 flex items-center border-b pb-2">
                <FaPlus className="mr-2" /> Manajemen Galeri Foto
            </h3>
            
            {/* Form Tambah Foto */}
            <form onSubmit={handleUploadSubmit} className="space-y-4 mb-8">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" required className="w-full p-1 border rounded" />
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption Singkat (Wajib)" required className="w-full p-2 border rounded" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi Foto" rows="2" className="w-full p-2 border rounded"></textarea>
                
                {message && <div className={`p-2 text-sm rounded ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition flex items-center justify-center">
                    {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaCloudUploadAlt className="mr-2" />} {loading ? 'Mengunggah...' : 'Unggah Foto'}
                </button>
            </form>

            {/* Daftar Foto Saat Ini */}
            <h3 className="text-xl font-oswald text-amber-600 flex items-center border-t pt-4"><FaFileImage className="mr-2" /> Kelola Foto ({galleryData.length})</h3>
            
            {isFetching ? (
                <p className="text-sm text-gray-500">Memuat daftar...</p>
            ) : (
                <ul className="mt-3 space-y-3">
                    {galleryData.map((photo) => (
                        <li key={photo.foto_id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="truncate text-sm font-medium">{photo.caption}</span>
                            <div className="flex space-x-2">
                                <a href={`http://localhost:5000${photo.image_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm">Lihat</a>
                                <button onClick={() => handleDelete(photo.foto_id)} className="text-red-500 hover:text-red-700 p-1">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GalleryManager;