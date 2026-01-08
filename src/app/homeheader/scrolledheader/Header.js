"use client"
import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';
import '../styles.css'
import Category from './Category';

const Header = () => {

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  
  return (
    <div className='hidden md:block max-w-screen max-h-[250px] bg-white'>

      <div className='flex items-center justify-around p-5'>
        
        {/* Empty div to take up space on the left */}
        <div className="flex-grow"></div>

        {/* Logo */}
        <div className="flex justify-center items-center">
          <img 
            src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/pothys-original-trimmed.svg' 
            alt='logo'
            style={{ width: '15%', height: 'auto' }} 
            className='w-1/4 md:w-full'
          />
        </div>

        {/* Empty div to take up space on the left */}
        <div className="flex-grow"></div>

        {/* Cart */}
        <Link href='/cart'>
          <div className="relative text-center text-lg">
            <div className='flex flex-col items-center justify-center cursor-pointer'>

                <div className='absolute top-5 -right-1'>
                  <div className='p-2 bg-black flex justify-center items-center rounded-md' style={{ width: '25px', height: '25px' }}>
                    <span className='text-md text-white text3'> {cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} </span>
                  </div>
                </div>

                <div className='w-3/4 p-2 rounded-lg bg-red-400'>
                  <img 
                    src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/shoppingcart.svg' 
                    alt='cart'
                    style={{ width: '100%', height: 'auto' }} 
                    className='w-1/2'
                  />
                </div>

            </div>
          </div>
        </Link>
        
      </div>   

      <Category />  
    </div>
  );
}

export default Header;