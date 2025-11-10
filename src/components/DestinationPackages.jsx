import React, { useState, useEffect } from 'react';
import { FaClock, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/packages'; 

const DestinationPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setPackages(result.data);
        } else {
          throw new Error('Data format error from API');
        }
      } catch (e) {
        console.error("Gagal mengambil data paket:", e);
        setError("Gagal memuat paket wisata. Silakan cek server backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []); 

  if (loading) {
    return <section className="text-center py-20"><p className="text-2xl font-oswald text-blue-600">Memuat paket wisata...</p></section>;
  }

  if (error) {
    return <section className="text-center py-20"><p className="text-2xl font-oswald text-red-600">{error}</p></section>;
  }

  return (
    <section id="destination" className="py-20 bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Judul Utama */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-wider text-blue-600 font-oswald">
          PAKET WISATA PILIHAN
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {packages.map((pkg) => ( 
            
            <div 
              key={pkg.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300"
            >
              {/* Gambar Card */}
              <div className="h-60 overflow-hidden">
                <img 
                  src={pkg.gambar_url} 
                  alt={pkg.nama} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 space-y-4">
                {/* Nama Paket */}
                <h3 className="text-2xl font-semibold text-amber-500 font-oswald border-b pb-2">
                  {pkg.nama}
                </h3>
                
                {/* Lokasi */}
                <p className="flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" /> {pkg.lokasi}
                </p>

                {/* Penjelasan Ringkas */}
                <p className="text-gray-600 line-clamp-3">
                  {pkg.deskripsi}
                </p>

                {/* Detail Waktu & Harga */}
                <div className="flex justify-between pt-3 border-t">
                  <p className="flex items-center text-lg font-medium text-gray-700">
                    <FaClock className="mr-2 text-blue-500" /> {pkg.durasi}
                  </p>
                  <p className="flex items-center text-xl font-bold text-green-600">
                    <FaTag className="mr-2" /> Rp {Number(pkg.harga).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Tombol Aksi */}
                <Link 
                  to={`/package/${pkg.id}`} 
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium text-center inline-block"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default DestinationPackages;