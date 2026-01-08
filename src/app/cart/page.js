"use client"
import React, { createContext, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input";
import Header from './Header';
import '../styles.css'
import Footer from '../footer/Footer';
import generateInvoice from '../invoice/page';
import HeaderParent from './HeaderParent';
import CartProducts from './CartProducts';
import CartParent from './CartParent';
import FooterParent from '../footer/FooterParent';
import { useTransaction } from './TransactionContext';
import CustomerForm from './CustomerForm';

const Cart = () => {

  return (

    <div className='overflow-x-hidden w-full'>
      <header className="top-0 header-sdw w-full">
        <HeaderParent />
      </header>

      {/* <div className='p-2 md:p-10 grid grid-rows-2 md:grid-cols-2 space-y-10 md:space-x-10 items-stretch'> */}
      <div className='p-2 flex flex-col gap-10 justify-center items-center w-full border border-gray-400'>

        {/* cart */}
        <CartParent />

        <CustomerForm />

      </div>

      <footer>
        <FooterParent />
      </footer>
    </div>
  );
};

export default Cart;