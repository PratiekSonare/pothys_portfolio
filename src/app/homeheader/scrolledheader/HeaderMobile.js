"use client"
import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';
import '../styles.css'

const Header = () => {

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  
  return (
    <div className='flex md:hidden max-w-screen max-h-[150px] bg-white'>

      <div className='grid grid-cols-[2fr_4fr_1fr] items-center justify-between p-5'>
        
        {/* Logo */}
        <div className="flex justify-start items-center">
          <img 
            src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/pothys-original-trimmed.svg' 
            alt='logo'
            style={{ width: '100%', height: 'auto' }} 
            className=''
          />
        </div>


        {/* Empty div to take up space on the left */}
        <div className="flex-grow"></div>
        
                
        {/* Cart */}
        <Link href='/cart'>
          <div className="relative text-center text-lg">
            <div className='flex flex-col items-center justify-center cursor-pointer scale-75'>

                <div className='absolute top-5 -right-1'>
                  <div className='p-2 bg-black flex justify-center items-center rounded-md' style={{ width: '25px', height: '25px' }}>
                    <span className='text-md text-white text3'> {cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} </span>
                  </div>
                </div>

                <div className='w-full p-2 rounded-lg bg-red-400'>
                  <img 
                    src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/shoppingcart.svg' 
                    alt='cart'
                    style={{ width: '100%', height: 'auto' }} 
                    className=''
                  />
                </div>

            </div>
          </div>
        </Link>
        
      </div>      
    </div>
  );
}

export default Header;