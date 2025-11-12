// src/components/PhotoGallery.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Tambah useMemo
import { 
    FaChevronLeft, FaChevronRight, FaCameraRetro, FaArrowLeft, 
    FaFileImage, FaTimesCircle, FaSpinner 
} from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 

const API_GALLERY_URL = 'http://localhost:5000/api/admin/gallery'; 

// Data Dummy Gambar untuk Carousel (DIHAPUS, akan diganti dari API)
// const carouselImages = [ ... ]; 

const PhotoGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    
    // State untuk semua foto galeri dari backend
    const [allGalleryPhotos, setAllGalleryPhotos] = useState([]); 
    const [loadingGallery, setLoadingGallery] = useState(true);
    
    const [selectedImage, setSelectedImage] = useState(null); 

    // 🚀 NEW: State untuk menyimpan foto-foto yang dipilih secara random untuk carousel
    const [randomCarouselPhotos, setRandomCarouselPhotos] = useState([]);
    const CAROUSEL_PHOTO_COUNT = 4; // Jumlah foto yang ingin ditampilkan di carousel

    // 1. Effect untuk mengambil semua foto galeri dari Backend
    useEffect(() => {
        const fetchGalleryPhotos = async () => {
            setLoadingGallery(true);
            const token = localStorage.getItem('token'); 
            
            try {
                const response = await fetch(API_GALLERY_URL, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const data = await response.json();
                
                if (response.ok && data.success) {
                    setAllGalleryPhotos(data.data); // Simpan semua foto
                    
                    // 🚀 LOGIC BARU: Pilih foto random untuk carousel
                    if (data.data.length > 0) {
                        const shuffled = [...data.data].sort(() => 0.5 - Math.random());
                        // Ambil sejumlah foto sesuai CAROUSEL_PHOTO_COUNT
                        setRandomCarouselPhotos(shuffled.slice(0, CAROUSEL_PHOTO_COUNT));
                    }
                }
            } catch (error) {
                console.error("Gagal memuat foto galeri:", error);
            } finally {
                setLoadingGallery(false);
            }
        };
        fetchGalleryPhotos();
    }, []);

    // 2. Logika Geser Otomatis (Autoplay)
    useEffect(() => {
        // Hanya jalankan autoplay jika ada foto di carousel
        if (randomCarouselPhotos.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % randomCarouselPhotos.length);
        }, 5000); 
        return () => clearInterval(interval);
    }, [randomCarouselPhotos]); // Dependensi ke randomCarouselPhotos

    const goToNext = () => {
        if (randomCarouselPhotos.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % randomCarouselPhotos.length);
    };

    const goToPrev = () => {
        if (randomCarouselPhotos.length === 0) return;
        setCurrentIndex((prevIndex) => 
            (prevIndex - 1 + randomCarouselPhotos.length) % randomCarouselPhotos.length
        );
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 font-sans">
            <div className="container mx-auto max-w-6xl px-4"> 
                
                <h1 className="text-4xl font-oswald text-center text-blue-600 uppercase mb-4 border-b pb-2">
                    Galeri Foto Perjalanan
                </h1>
                
                <div className="text-center mb-10">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-5 rounded-lg font-semibold transition flex items-center mx-auto"
                    >
                        <FaArrowLeft className="mr-2" /> Kembali ke Halaman Utama
                    </button>
                </div>

                {/* === 1. CAROUSEL DISPLAY (GULIR) - SEKARANG DARI API === */}
                <div className="relative w-full overflow-hidden rounded-xl shadow-2xl mb-10">
                    {loadingGallery ? (
                        <div className="flex items-center justify-center h-[500px] bg-gray-200 text-gray-600">
                            <FaSpinner className="animate-spin mr-2" /> Memuat Carousel...
                        </div>
                    ) : randomCarouselPhotos.length === 0 ? (
                        <div className="flex items-center justify-center h-[500px] bg-gray-200 text-gray-600">
                            Belum ada foto untuk Carousel.
                        </div>
                    ) : (
                        <>
                            <div className="flex transition-transform duration-500 ease-in-out" 
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                {randomCarouselPhotos.map((photo, index) => ( // Gunakan randomCarouselPhotos
                                    <div key={photo.foto_id} className="w-full flex-shrink-0 h-[500px]">
                                        <img 
                                            src={`http://localhost:5000${photo.image_url}`} // Full URL
                                            alt={photo.caption} 
                                            className="w-full h-full object-cover" 
                                        />
                                        {/* Optional: Tampilkan caption di carousel juga */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white text-lg font-semibold">
                                            {photo.caption}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={goToPrev} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition">
                                <FaChevronLeft />
                            </button>
                            <button onClick={goToNext} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition">
                                <FaChevronRight />
                            </button>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                {randomCarouselPhotos.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full cursor-pointer transition ${
                                            currentIndex === index ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
                                        }`}
                                        onClick={() => setCurrentIndex(index)}
                                    ></div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                <hr className="my-10 border-gray-300"/> 

                {/* === 2. PHOTO GRID 4X4 (DARI SEMUA FOTO API) === */}
                <h2 className="text-3xl font-oswald text-center text-purple-700 uppercase mb-8 flex items-center justify-center">
                    <FaCameraRetro className="mr-3" /> Semua Koleksi Foto
                </h2>

                {loadingGallery ? (
                    <div className="text-center py-10"><FaSpinner className="animate-spin mr-2 inline" /> Memuat Galeri...</div>
                ) : allGalleryPhotos.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Belum ada foto yang ditambahkan.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> 
                        {allGalleryPhotos.map((photo) => ( // Gunakan allGalleryPhotos untuk grid
                            <div 
                                key={photo.foto_id} 
                                className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300 relative cursor-pointer"
                                onClick={() => setSelectedImage({
                                    id: photo.foto_id, 
                                    image: `http://localhost:5000${photo.image_url}`, 
                                    caption: photo.caption,
                                    description: photo.description || "Tidak ada deskripsi tersedia.",
                                })} 
                            >
                                <img 
                                    src={`http://localhost:5000${photo.image_url}`} 
                                    alt={photo.caption} 
                                    className="w-full h-48 object-cover transition duration-500 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                    <p className="text-white text-sm font-semibold p-2 text-center">{photo.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL OVERLAY (Tidak berubah, karena selectedImage akan berisi Full URL) */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
                    onClick={closeModal} 
                >
                    <div 
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition duration-300 scale-100 shadow-2xl"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-bold text-gray-800">{selectedImage.caption}</h3>
                            <button onClick={closeModal} className="text-gray-600 hover:text-red-500 transition text-3xl" aria-label="Close">
                                <FaTimesCircle />
                            </button>
                        </div>
                        
                        <div className="p-4">
                            <img 
                                src={selectedImage.image} 
                                alt={selectedImage.caption} 
                                className="w-full h-auto rounded-lg mb-4 shadow-md"
                            />
                            <p className="text-gray-700 mt-2 p-2 border-l-4 border-blue-500 bg-blue-50/50">
                                {selectedImage.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;