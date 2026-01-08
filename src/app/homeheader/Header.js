"use client"
import React, {useState} from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';
import '../styles.css'
import Category from './Category';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import MainHeaderComp from './MainHeaderComp';
import { LuShoppingCart as ShoppingCart, LuShoppingCart as ShoppingCartIcon } from 'react-icons/lu';

const Header = () => {

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className='hidden md:block max-w-screen max-h-[250px] bg-white z-50'>

      <div className='grid grid-cols-[1fr_12fr_1fr] justify-between p-5'>

        {/* Logo */}
        <div className="flex justify-start items-center self-center">
          <img
            src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo_header.svg'
            alt='logo'
            style={{ width: '80%', height: 'auto' }}
            onClick={() => router.push("/")}
          />
        </div>

        {/* Category Buttons */}
        <div className='flex items-center justify-center z-[150]'>
          <MainHeaderComp />
        </div>


        {/* Cart and Login */}
        <div className='flex flex-row gap-5 justify-end items-center'>
          <Link href='/cart'>
            <div className="relative text-center text-lg">
              <div className='flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out'>

                <div className='absolute top-8 -right-3'>
                  <div className='p-2 bg-black border-2 border-red-300 flex justify-center items-center rounded-md' style={{ width: '25px', height: '25px' }}>
                      <span className='text-md text-white text3'> {cartItems?.reduce((sum, item) => sum + item.numOrder, 0) || 0} </span>
                  </div>
                </div>

                <div className='w-fit p-2 pr-3 rounded-lg bg-red-500 align-middle border-2 border-red-300'>
                  <ShoppingCartIcon style={{width: '30px', height: '30px'}} />
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