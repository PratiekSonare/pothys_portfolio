"use client"
import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';
import { useRouter } from 'next/navigation';
import { LuShoppingCart as ShoppingCartIcon } from 'react-icons/lu';

const Header = () => {
  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();

  const router = useRouter();

  return (
    <div className='hidden md:block max-w-screen max-h-[150px] bg-white'>
      <div className='grid grid-cols-3 items-center p-5 px-10'>

        {/* Left Icon (e.g., Cart Icon) */}
        <div className="flex justify-start">
          <Link href="/">
            <img
              src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/arrow.svg"
              alt="cart"
              className="w-8 h-auto cursor-pointer"
              onClick={() => router.push('/')}
            />
          </Link>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center">

          <img
            src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo_header.svg'
            alt='logo'
            style={{ width: '20%', height: 'auto' }}
            onClick={() => router.push("/")}

          />
        </div>

        {/* cart */}
        <div className='flex flex-row gap-5 justify-end items-center'>
          <Link href='/cart'>
            <div className="relative text-center text-lg">
              <div className='flex flex-col items-center justify-center cursor-pointer'>

                <div className='absolute top-8 -right-3'>
                  <div className='p-2 bg-black border-2 border-red-300 flex justify-center items-center rounded-md' style={{ width: '25px', height: '25px' }}>
                    <span className='text-md text-white text3'> {cartItems?.reduce((sum, item) => sum + item.numOrder, 0) || 0} </span>
                  </div>
                </div>

                <div className='w-fit p-2 pr-3 rounded-lg bg-red-500 align-middle border-2 border-red-300'>
                  <ShoppingCartIcon style={{ width: '30px', height: '30px' }} />
                </div>

              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Header;