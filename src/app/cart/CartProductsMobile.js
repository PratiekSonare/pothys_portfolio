"use client"
import React, { createContext, useState } from 'react';
import { Button } from "@/components/ui/button"; // Import Shadcn UI Button
import { Card } from "@/components/ui/card"; // Import Shadcn UI Card
import { Separator } from "@/components/ui/separator"; // Import Shadcn UI Separator
import { useCart } from './CartContext';
import { useForm } from 'react-hook-form';
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
  from '@/components/ui/form';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input";
import Header from './Header';
import '../styles.css'
import Footer from '../footer/Footer';
import generateInvoice from '../invoice/page';
import HeaderParent from './HeaderParent';

const CartProducts = () => {

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart, calculateTotal, calculateSavedTotal } = useCart();
  const total_amount = calculateTotal();
  const saved_total = calculateSavedTotal().toFixed(2);

  return (
    <div className='md:hidden'>
      <div className="p-5 w-screen pr-4 md:w-11/12 bg-white border border-gray-400 rounded-lg shadow-lg">
        <div className='flex justify-between md:justify-between'>
          <h1 className="text-2xl font-bold mb-4 text3">Your Cart</h1>
          <button onClick={clearCart} className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out'>
            <span className='text1 p-2'>Clear Cart</span>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-36 card-sdw bg-white rounded-lg'>
            <p className='text0 text-lg'>Your cart is empty.</p>
            <img
              src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/sad-svgrepo-com.svg'
              alt='sad'
              className=''
              style={{ width: '15%' }}>
            </img>
          </div>

        ) : (
          <div className='flex flex-col'>
            <div className='overflow-y-scroll flex-grow'>
              {cartItems.map((product, index) => {
                const numberOrdered = product.numOrder;
                const product_price = (numberOrdered * product.price).toFixed(2);
                const discount_price = product.price * (1 - product.discount_lower / 100);
                const product_discounted_price = (numberOrdered * discount_price).toFixed(2);

                return (
                  <Card key={`${product._id}-${product.quantityType}` || index} className="bg-gray-100 w-full mb-4 px-2 md:p-4">

                    <div className="grid grid-cols-[auto_1fr] space-x-0 w-full">

                      {/* left */}
                      <div className='flex items-center justify-start rounded-lg flex-shrink-0'>
                        <img
                          src={product.imageURL}
                          alt="cartproduct"
                          key={product._id || index}
                          className='w-1/3 md:w-[25%] object-cover rounded-lg'
                        />
                        <div className='ml-2 md:ml-5 md:scale-100'>
                          <h2 className="text1 text-gray-600 text-xs md:text-base font-semibold -mb-2">{product.brand}</h2>
                          <h2 className="text2 text-sm/4 mt-2 md:text-lg font-semibold ">{product.name}</h2>
                          <h2 className="text0 text-xs self-end">{product.quantityType}</h2>
                        </div>
                      </div>

                      {/* right */}
                      <div className='flex-1 flex flex-row items-center justify-center scale-75 md:scale-100 gap-5 md:gap-5'>

                        {/* buttons */}
                        <div className='flex flex-col gap-2 w-full'>
                          <div className='flex flex-row gap-1 text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200 ease-in-out'>
                            <button onClick={() => decrementQ(product)} className="w-1/3 h-full flex items-center justify-center">-</button>
                            <button className="w-1/3 h-full flex items-center justify-center">
                              <span className="font-bold">{product.numOrder}</span>
                            </button>
                            <button onClick={() => incrementQ(product)} className="w-1/3 h-full flex items-center justify-center">+</button>
                          </div>

                          <div className='flex flex-row text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 ease-in-out'>
                            <button onClick={() => removeFromCart(product._id)}>
                              <span className='text1 text-sm p-2'>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* quantity */}
                        <div className='flex flex-col gap-2 w-full'>
                          <div className='flex flex-col'>
                            <span className='text-[15px] md:text-xs text0 self-end text-gray-600'>Quantity:</span>
                            <span className='self-end text2 text-xl md:text-lg text-black tracking-tighter'>
                              {product.quantity} x {product.quantityType}
                            </span>
                          </div>

                          <div className='flex flex-col'>
                            <p className='text-[15px] md:text-xs text0 self-end text-gray-600'>Final Price:</p>
                            <span className='self-end text2 text-xl md:text-lg text-black'>₹{(product.discount_lower > 0 ? product_discounted_price : product_price)}</span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </Card>
                );
              })}

              <Separator className="mt-4 mb-2" />
            </div>

            <div className="flex justify-between">
              <div className='flex flex-col items-center justify-center'>
                {saved_total > 0 ?
                  <div className='flex flex-col text-center'>
                    <span className='text1 text-gray-600 text-md md:text-lg'>You're saving a total of</span>
                    <span className='text2 text-gray-600 text-2xl md:text-2xl'><span className='text-3xl text-green-400'>₹{saved_total}  </span>!</span>
                  </div>
                  :
                  <div className='flex flex-col text-center'>
                    <span className='text1 text-gray-600 text-md md:text-lg'>Need anything else?</span>
                    <span className='text2 text-green-400 text-lg md:text-2xl'>Shop now!</span>
                  </div>

                }
              </div>

              <Separator orientation='vertical' className="my-4" />

              <div className='flex flex-col px-5'>
                <span className='text1 text-gray-600 text-lg self-end mt-4'>Total:</span>
                <span className='text2 text-3xl self-end'>₹{total_amount.toFixed(2)}</span>
                <div className='self-end'>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className='p-0'><span className='text-xs text0 text-gray-500'>+ View Price Breakdown</span></Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-55">
                      <div className='flex flex-col gap-2 text0 text-xs'>
                        <div className='flex flex-row justify-between'>
                          <span className='text-gray-400'>+Delivery Charges</span>
                          <span className='text-gray-600'>₹2</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                          <span className='text-gray-400'>+CGST</span>
                          <span className='text-gray-600'>₹2</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                          <span className='text-gray-400'>+SGST</span>
                          <span className='text-gray-600'>₹2</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                          <span className='text-gray-400'>+Platform Fee</span>
                          <span className='text-gray-600'>₹5</span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>

            </div>
            <Separator className="my-2" />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartProducts