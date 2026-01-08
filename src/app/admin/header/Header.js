"use client"
import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/cart/CartContext';
import { LuPackageOpen as BaggageClaim, LuCircleDollarSign as CircleDollarSign, LuHouse as House, LuLock as Lock, LuPackage as Package, LuShoppingCart as ShoppingCart } from 'react-icons/lu';

const Header = () => {
  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  
  const router = useRouter();
  const buttonStyle = 'w-full flex flex-row gap-2 justify-center items-center text-xs border border-red-500 rounded-md hover:bg-red-500 transition-colors duration-300 ease-in-out hover:text-white w-fit p-1 text0';
  return (
    <div className='hidden md:block max-w-screen max-h-[150px] bg-white'>
      <div className='flex flex-row items-center justify-between p-5'>
        {/* Left Icon (e.g., Cart Icon) */}
        <div className="flex justify-start">
          <Link href="/">
            <img 
              src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/arrow.svg" 
              alt="cart"
              className="w-8 h-auto cursor-pointer" 
              onClick={() => router.push("/")}
            />
          </Link>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          
          <img 
            src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo.svg' 
            alt='logo'
            style={{ width: '20%', height: 'auto' }}
            onClick={() => router.push("/admin/home")}
          />
        </div>
        
        <div className='grid grid-cols-3 grid-rows-2 items-end gap-1 gap-x-1'>
          <button className={buttonStyle} onClick={()=>router.push("/admin/inv")}> <House style={{width: '15px'}}/> Home</button>
          <button className={buttonStyle} onClick={()=>router.push("/admin/fin")}> <Package style={{width: '15px'}}/> Delivery</button>
          <button className={buttonStyle} onClick={()=>router.push("/admin/inv")}> <BaggageClaim style={{width: '15px'}}/> Inventory</button>
          <button className={buttonStyle} onClick={()=>router.push("/admin/fin")}> <CircleDollarSign style={{width: '15px'}}/> Finance</button>
          <button className={buttonStyle} onClick={()=>router.push("/admin/activity")}> <Lock style={{width: '15px'}} /> Admin</button>
          <button className={buttonStyle} onClick={()=>router.push("/admin/fastcart")}> <ShoppingCart style={{width: '15px'}}/> Fast Cart</button>
        </div>

      </div>      
    </div>
  );
}

export default Header;