"use client"
import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';
import '../styles.css'
import { useRouter } from 'next/navigation';
import MainHeaderCompMobile from './MainHeaderCompMobile';
import { LuShoppingCart as ShoppingCart, LuShoppingCart as ShoppingCartIcon } from 'react-icons/lu';

const Header = () => {

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  return (
    <div className=''>
      <div className='flex md:hidden max-w-screen h-fit bg-white'>

        <div className='flex-0 grid grid-cols-[1fr_5fr_1fr] items-center justify-between p-5'>

          {/* Logo */}
          <div className="flex justify-start items-center">
            <img
              src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo_header.svg'
              alt='logo'
              style={{ width: '110%', height: 'auto' }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Empty div to take up space on the left */}
          <div className="flex-1 w-full">
            <MainHeaderCompMobile />
          </div>


          {/* Cart */}
          <Link href='/cart'>
            <div className="relative text-center text-lg">
              <div className='flex flex-col items-center justify-center cursor-pointer scale-75 hover:scale-100 transition-all duration-300 ease-in-out'>

                <div className='absolute top-6 -right-2'>
                  <div className='p-2 bg-black border-2 border-red-400 flex justify-center items-center rounded-md' style={{ width: '25px', height: '25px' }}>
                    <span className='text-md text-white text3'> {cartItems?.reduce((sum, item) => sum + item.numOrder, 0) || 0} </span>
                  </div>
                </div>

                <div className='w-fit p-2 pr-3 rounded-lg bg-red-500 border-2 border-red-400 align-middle'>
                  <ShoppingCartIcon style={{ width: '28px', height: '28px' }} />
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