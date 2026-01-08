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
import '../styles.css'
import { useTransaction } from './TransactionContext';

const CustomerForm = () => {

  const router = useRouter();

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart, calculateTotal } = useCart();
  const {handleTransaction, loading} = useTransaction(); 

  const total_amount = calculateTotal();

  const form = useForm({
    defaultValues: {
      customer_name: "",
      phone: "",
      address: "",
    },
  });

    return (
        <div className='w-full md:w-1/2 mb-10'>
            {/* customer form */}
            <div className="md:px-5 p-5 bg-white rounded-lg border border-gray-400 shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text3">Customer Details</h1>

                <div className='space-y-5 text0 md:w-full md:block '>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(handleTransaction)} className='space-y-5 text0'>
                            <FormField
                                control={form.control}
                                name="customer_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Customer Name" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Phone Number (+91)" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="403, Shanti Niketan, Puducherry - 400000" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <Button
                                    className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 ease-in-out'
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Complete Transaction'}
                                </Button>
                            </div>
                        </form>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default CustomerForm