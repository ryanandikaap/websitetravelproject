// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTiktok, FaFacebookF, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  
  const navItemsLeft = ['Home', 'About', 'Destination'];
  const navItemsRight = ['Photo', 'Review', 'Contact'];

  const logoPath = '/logo.png'; 

  useEffect(() => {
    // ... (Logika cek login tetap sama)
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (e) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/'; 
  };

  const handleScrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const renderNavItems = (items) => (
    items.map((item) => {
      const lowerItem = item.toLowerCase();
      if (['about', 'destination'].includes(lowerItem)) {
          return (
              <a 
                  key={item} 
                  href={`#${lowerItem}`} 
                  onClick={(e) => {
                      e.preventDefault(); 
                      handleScrollToSection(lowerItem); 
                  }}
                  className="hover:text-amber-400 transition duration-300 font-medium text-xl"
              >
                  {item}
              </a>
          );
      }
      
      return (
        <Link 
          key={item} 
          to={`/${lowerItem === 'home' ? '' : lowerItem}`} 
          className="hover:text-amber-400 transition duration-300 font-medium text-xl"
        >
          {item}
        </Link>
      );
    })
  );

  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-2 px-8 text-white"> 
      <div className="flex justify-between items-center">
        
        {/* Kiri: Nama Perusahaan */}
        <div className="flex items-center space-x-8">
          <p className="font-semibold text-xl tracking-wider">PT MISTER BALI HOLIDAY</p>
        </div>

        {/* Tengah: Navigasi Menu & Logo */}
        <div className="hidden lg:flex items-center space-x-4"> 
          {renderNavItems(navItemsLeft)}
          
          {/* LOGO TENGAH */}
          <div className="flex items-center mx-4">
            <img 
              src={logoPath}
              alt="Logo" 
              className="w-32 h-32 object-contain" 
            />
          </div>

          {renderNavItems(navItemsRight)}
        </div>
        
        {/* Kanan: Social Media Icons + Tombol Otentikasi */}
        <div className="flex items-center space-x-4 text-xl">
          
          {/* Ikon Sosial Media */}
          <FaTiktok className="hover:text-amber-400 cursor-pointer" />
          <FaInstagram className="hover:text-amber-400 cursor-pointer" />
          <FaFacebookF className="hover:text-amber-400 cursor-pointer" />

          {/* Pemisah */}
          <div className="w-px h-6 bg-white/50 ml-4"></div> 
          
          {/* Tombol Dashboard/Logout/Login */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link 
                to="/dashboard" 
                className={`flex items-center text-white py-1 px-3 rounded-full transition text-base ${
                    userRole === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <FaUserCircle className="mr-1" /> 
                {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-base text-white hover:text-amber-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-amber-500 hover:bg-amber-600 text-white text-base py-1 px-3 rounded-full transition"
            >
              Login / Daftar
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;