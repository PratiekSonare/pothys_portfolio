"use client"
import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import generateInvoice from '../invoice/page';
import { useCart } from './CartContext';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { cartItems, calculateTotal, clearCart } = useCart();

    const total_amount = calculateTotal();

    const handleTransaction = async (data) => {
        console.log("Customer data:", data);
        console.log("Cart Items:", cartItems);
        console.log("Total Amount:", total_amount);

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartItems,
                    total_amount,
                    payment_method: "UPI",
                    customer: data,
                    status: "success",
                    delivery_status: "pending"
                })
            });

            const result = await response.json();

            console.log("Response data:", result);

            if (result.success) {
                alert(`Transaction successful! Transaction ID: ${result.transaction_id}`);

                await Promise.all(cartItems.map(async (item) => {
                    try {
                        console.log(`updating inventory for ${item._id}`);
                        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/decsto/${item._id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ numOrder: item.numOrder }),
                        });
                    } catch (err) {
                        console.error(`Failed to decrement stock for product ${item._id}`, err);
                    }
                }));

                try {
                    window.open(`/invoice?transaction_id=${result.transaction_id}`, '_blank');
                    router.push('/');
                    clearCart();
                } catch (error) {
                    console.error('Invoice generation failed: ', error);
                    alert('An error occurred while generating invoice.');
                }
            } else {
                alert(`Transaction failed. Reason: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Transaction failed: ', error);
            alert('An error occurred while processing the transaction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TransactionContext.Provider value={{ handleTransaction, loading }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => useContext(TransactionContext);
