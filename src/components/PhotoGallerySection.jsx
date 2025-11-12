// src/components/PhotoGallerySection.jsx
import React from 'react';
import { FaCameraRetro } from 'react-icons/fa';

// Data Dummy Gambar untuk Tiga Kartu
const photoCards = [
  { id: 1, title: 'Keindahan Bali: Tanah Lot', image: '/gallery/bali-tanahlot.jpg', area: 'Bali' },
  { id: 2, title: 'Warisan Jawa: Candi Borobudur', image: '/gallery/jogja-borobudur.jpg', area: 'Jawa' },
  { id: 3, title: 'Pesona Lombok: Gili Trawangan', image: '/gallery/lombok-gili.jpg', area: 'Lombok' },
];

const PhotoGallerySection = () => {
  return (
    <section id="photo" className="py-20 bg-white text-gray-800">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Judul Utama */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 uppercase tracking-wider text-purple-700 font-oswald flex items-center justify-center">
          <FaCameraRetro className="mr-3" /> INSPIRASI PERJALANAN
        </h2>
        
        {/* === GRID 3 KARTU FOTO === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photoCards.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:shadow-2xl hover:scale-[1.02] transition duration-300">
              
              {/* Gambar */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={photo.image} // 🛑 Pastikan Anda memiliki gambar dummy di public/gallery/
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Deskripsi */}
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{photo.title}</h3>
                <p className="text-sm text-amber-600 mt-1">Lokasi: {photo.area}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tautan ke Galeri Penuh (Opsional) */}
        <div className="text-center mt-12">
            <a 
                href="/photo" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full font-bold transition shadow-lg"
            >
                Lihat Semua Galeri
            </a>
        </div>

      </div>
    </section>
  );
};

export default PhotoGallerySection;