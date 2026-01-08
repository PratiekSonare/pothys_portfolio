import React from 'react';
import Link from 'next/link'; // Import Link from next/link

const Header = () => {
  
  return (
    <div className='max-w-screen max-h-[150px] bg-white'>
      <div className="grid grid-cols-3 items-center p-5 px-10">
        {/* Cart Icon */}
        <Link href="/admin/home" className="flex justify-start">
          <img 
            src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/arrow.svg" 
            alt="cart"
            className="w-8 h-auto" 
          />
        </Link>

        {/* Logo (Centered) */}
        <div className="flex justify-center items-center">
          <img 
            src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo.svg' 
            alt='logo'
            style={{ width: '20%', height: 'auto' }} 
            className='w-1/4 md:w-full'
          />
        </div>

        {/* Empty Space to Balance Layout */}
        <div></div>
        
      </div>
            
    </div>
  );
}

export default Header;