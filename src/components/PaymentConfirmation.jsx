// src/components/PaymentConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUpload, FaMoneyBillWave, FaBarcode, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';


const API_UPLOAD_URL = 'http://localhost:5000/api/booking/upload-payment'; 

const BANK_DETAILS = {
    'Transfer Bank': { name: 'Bank BCA', number: '1234 5678 90', owner: 'PT MISTER BALI HOLIDAY' },
    'QRIS': { name: 'QRIS', number: 'SCAN QR CODE', owner: 'GOPAY/SHOPEEPAY/OVO' },
    'Virtual Account': { name: 'Bank Mandiri VA', number: '8888 0000 1234 5678', owner: 'PT MISTER BALI HOLIDAY' },
};

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { bookingId, totalAmount, paymentMethod, whatsapp } = location.state || {};
    
    const [paymentFile, setPaymentFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const bankInfo = BANK_DETAILS[paymentMethod] || BANK_DETAILS['Transfer Bank'];
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!bookingId || !token) {
            alert('Akses tidak valid. Silakan buat pemesanan baru.');
            navigate('/');
        }
    }, [bookingId, token, navigate]);

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!paymentFile) {
            setUploadMessage('Harap pilih file bukti pembayaran.');
            return;
        }

        setUploading(true);
        setUploadMessage('Mengunggah dan Memproses...');

        const formData = new FormData();
        formData.append('bukti', paymentFile); 
        
        try {
            const response = await fetch(`${API_UPLOAD_URL}/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUploadMessage('✅ Bukti berhasil diunggah! Pesanan Anda sedang diproses.');
                setTimeout(() => navigate('/dashboard'), 3000); 
            } else {
                setUploadMessage(data.message || 'Gagal mengunggah. Coba lagi.');
            }

        } catch (error) {
            console.error('Error saat upload:', error);
            setUploadMessage('Koneksi server gagal saat upload. Cek backend.');
        } finally {
            setUploading(false);
        }
    };

    if (!bookingId) return null; 

    return (
        <div className="flex justify-center min-h-screen bg-gray-100 p-8">
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl">
                <h1 className="text-4xl font-oswald text-blue-600 mb-2 uppercase flex items-center">
                    <FaCheckCircle className="mr-3 text-green-500" /> Pemesanan Berhasil
                </h1>
                <p className="text-gray-600 mb-8 border-b pb-4">
                    Pemesanan Anda (ID: **{bookingId}**) telah dicatat. Segera lakukan pembayaran sebesar **Rp {Number(totalAmount).toLocaleString('id-ID')}**.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* KOLOM KIRI: DETAIL PEMBAYARAN */}
                    <div>
                        <h2 className="text-xl font-bold mb-3 text-purple-700 flex items-center">
                            <FaMoneyBillWave className="mr-2" /> Rincian Pembayaran ({paymentMethod})
                        </h2>
                        
                        <div className="space-y-3 p-4 bg-purple-50 rounded-lg border">
                            <p className="text-sm font-medium text-gray-700">Bank Tujuan:</p>
                            <p className="text-2xl font-extrabold text-blue-800 font-oswald">{bankInfo.name}</p>
                            
                            <p className="text-sm font-medium text-gray-700 mt-4">Nomor Rekening / Kode Virtual:</p>
                            <p className="text-3xl font-extrabold text-red-600 tracking-wider font-mono select-all">
                                {bankInfo.number}
                            </p>
                            <p className="text-sm text-gray-700">Atas Nama: {bankInfo.owner}</p>
                        </div>
                        
                        <p className="mt-4 text-xs text-gray-500">
                            **Wajib:** Transfer sesuai nominal **Rp {Number(totalAmount).toLocaleString('id-ID')}** agar verifikasi berjalan cepat.
                        </p>
                    </div>

                    {/* KOLOM KANAN: UPLOAD BUKTI */}
                    <div>
                        <h2 className="text-xl font-bold mb-3 text-purple-700 flex items-center">
                            <FaUpload className="mr-2" /> Unggah Bukti Transfer
                        </h2>

                        <form onSubmit={handleUploadSubmit} className="space-y-4 p-4 border rounded-xl shadow-md">
                            <p className="text-sm text-gray-600">
                                Setelah transfer, unggah foto/screenshot bukti pembayaran Anda.
                            </p>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih File Bukti Bayar</label>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    onChange={(e) => setPaymentFile(e.target.files[0])}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                                {paymentFile && <p className="text-xs text-green-600 mt-1">File terpilih: {paymentFile.name}</p>}
                            </div>

                            {uploadMessage && (
                                <div className={`p-3 text-sm rounded ${uploadMessage.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {uploadMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={uploading || !paymentFile}
                                className={`w-full py-2 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center ${uploading || !paymentFile ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {uploading ? 'Mengunggah...' : <span><FaUpload className="mr-2" /> KONFIRMASI & UNGGAH</span>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;