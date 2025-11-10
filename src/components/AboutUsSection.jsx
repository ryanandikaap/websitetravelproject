// src/components/AboutUsSection.jsx
import React from 'react';

const AboutUsSection = () => {
  const aboutImagePath = '/gambarorg.jpg'; // Path gambar Anda

  return (
    <section id="about" className="py-20 bg-white text-gray-800">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Judul Utama */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 uppercase tracking-wider text-amber-500 font-oswald">
          TENTANG KAMI
        </h2>
        
        {/* Konten & Gambar (Flexbox 2 Kolom Utama) */}
        <div className="flex flex-col md:flex-row items-center md:space-x-12 max-w-6xl mx-auto">
          
          {/* 🚀 Kiri: Teks Penjelasan + Statistik (Diatur dengan flex-col) */}
          <div className="md:w-1/2 flex flex-col space-y-8 mb-10 md:mb-0"> 
            
            {/* Bagian Teks Penjelasan */}
            <div className="text-center md:text-left space-y-6 text-lg">
              <p>
                **PT MISTER BALI HOLIDAY** telah berkomitmen untuk menjadi mitra perjalanan terbaik Anda di wilayah **Jawa, Bali, dan Lombok**. Kami percaya bahwa setiap perjalanan harus unik, berkesan, dan tanpa repot.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit enim dolorum autem atque ut minus labore reiciendis architecto fugiat. Asperiores dolorum perferendis tempora ut, optio similique nobis rerum qui officiis officia incidunt labore quaerat. Corrupti deleniti iusto quasi, consequuntur fuga obcaecati voluptate veniam, at exercitationem adipisci et voluptatem unde ut.
              </p>
              <p className="font-semibold text-gray-600">
                Misi kami adalah membuat liburan impian Anda menjadi kenyataan—dengan keandalan dan hati.
              </p>
            </div>

            {/* 🚀 Statistik Cepat (SEKARANG BERADA DI DALAM KOLOM KIRI) */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-4 border-gray-300">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 font-oswald">100+</p>
                <p className="text-xs uppercase tracking-widest mt-1">Klien Bahagia</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 font-oswald">4</p>
                <p className="text-xs uppercase tracking-widest mt-1">Tahun Pengalaman</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 font-oswald">3</p>
                <p className="text-xs uppercase tracking-widest mt-1">Wilayah Spesialis</p>
              </div>
            </div>
            {/* Akhir Statistik */}

          </div>
          
          {/* Kanan: Gambar */}
          <div className="md:w-1/2">
            <img 
              src={aboutImagePath} 
              alt="Mister Bali Holiday Team" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>

        </div> {/* Akhir dari flex container konten & gambar */}
        
        {/* Hapus bagian statistik lama di bawah container flexbox */}
        
      </div>
    </section>
  );
};

export default AboutUsSection;