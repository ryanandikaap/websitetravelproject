// src/components/HeroSection.jsx
import React from 'react';
import DestinationCard from './DestinationCard';

const destinations = [
  { name: 'Bali', imageUrl: '/lombok.jpg' },    
  { name: 'Jawa', imageUrl: '/jawa.jpg' },  
  { name: 'Lombok', imageUrl: '/lombok.jpg' } 
];

const HeroSection = () => {
  return (
    <div 
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden"
      style={{
        // Ganti dengan path gambar latar belakang Anda
        backgroundImage: 'url(/pemandangan.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay Gelap untuk Kontras Teks */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Konten */}
      <div className="relative z-10 text-center pt-20">
        <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight">
          YUK PILIH DESTINASI
        </h1>
        <h2 className="text-white text-3xl md:text-5xl font-light mt-2 tracking-wide">
          LIBURANMU
        </h2>
      </div>

      {/* Kartu Destinasi */}
      <div className="relative z-10 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12 mt-16">
        {destinations.map((dest) => (
          <DestinationCard 
            key={dest.name} 
            name={dest.name} 
            imageUrl={dest.imageUrl} 
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;