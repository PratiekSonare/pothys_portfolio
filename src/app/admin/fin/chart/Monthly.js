"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const Monthly = () => {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]); // State for monthly data
    const [showRevenue, setShowRevenue] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it's client-side
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                console.log("No token found, redirecting...");
                router.push("/admin/admin-login");
            } else {
                fetchTransactions(); // Fetch data only after token is set
            }
        }
    }, [router]); // Run once when the component mounts

    const fetchTransactions = async () => {
        const adminToken = localStorage.getItem("adminToken");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions`, {
                headers: {
                    "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
                  },
            });
            setTransactions(response.data.transactions);

            // Calculate total revenue
            const revenue = response.data.transactions.reduce((total, txn) => total + txn.total_amount, 0);
            setTotalRevenue(revenue);

            // Prepare monthly revenue data
            const monthlyRevenue = {};

            response.data.transactions.forEach(txn => {
                const date = new Date(txn.date_time);
                const monthlyKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                // Monthly data
                if (!monthlyRevenue[monthlyKey]) {
                    monthlyRevenue[monthlyKey] = { total: 0, count: 0 };
                }
                monthlyRevenue[monthlyKey].total += txn.total_amount;
                monthlyRevenue[monthlyKey].count += 1;
            });

            // Convert monthlyRevenue object to array
            const monthlyArray = Object.keys(monthlyRevenue).map(date => ({
                date,
                total: monthlyRevenue[date].total,
                count: monthlyRevenue[date].count,
            }));
            setMonthlyData(monthlyArray);

        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return (
        <div className='text0 bg-white shadow-lg p-5 rounded-lg my-10'>
            <div className='flex flex-row justify-between gap-2'>
                <h2 className="text-xl text3 mb-2">{showRevenue ? 'Monthly Revenue' : 'Monthly Transactions'}</h2>
                <div className='flex flex-row gap-2'>
                    <div className="mb-4">
                        <Button onClick={() => setShowRevenue(true)} className={`mr-2 ${showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Revenue
                        </Button>
                        <Button onClick={() => setShowRevenue(false)} className={`mr-2 ${!showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Transactions
                        </Button>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {showRevenue ? (
                        <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                    ) : (
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Monthly;