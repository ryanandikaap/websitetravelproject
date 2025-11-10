// src/components/DestinationCard.jsx
import React from 'react';

const DestinationCard = ({ name, imageUrl }) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div 
        className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl 
                   transition-transform duration-500 ease-in-out transform hover:scale-105 
                   hover:shadow-2xl border-4 border-white"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay untuk tampilan yang lebih baik jika dibutuhkan */}
        <div className="w-full h-full bg-black bg-opacity-10 group-hover:bg-opacity-0 transition duration-300"></div>
      </div>
      <p className="mt-4 text-white text-xl md:text-2xl font-semibold tracking-wider group-hover:text-amber-400 transition duration-300">
        {name}
      </p>
    </div>
  );
};

export default DestinationCard;