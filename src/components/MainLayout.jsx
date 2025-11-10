// src/components/MainLayout.jsx
import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import AboutUsSection from './AboutUsSection';
import DestinationPackages from './DestinationPackages';


const MainLayout = () => {
  return (
    <div className="App">
      <Header />
      
      <main>
        <HeroSection />          {/* Destinasi Awal */}
        <AboutUsSection />       {/* Tentang Kami */}
        <DestinationPackages />  {/* Katalog Paket */}
        {/* Tambahkan bagian lain di sini (Review, Contact, Footer, dll.) */}
      </main>
    </div>
  );
};

export default MainLayout;