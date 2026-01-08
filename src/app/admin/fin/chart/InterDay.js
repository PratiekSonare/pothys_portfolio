"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const InterDayTransactions = () => {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showRevenue, setShowRevenue] = useState(true);
    const [granularity, setGranularity] = useState('hours'); // New state for granularity

    useEffect(() => {
        if (typeof window !== "undefined") {
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                console.log("No token found, redirecting...");
                router.push("/admin/admin-login");
            } else {
                fetchTransactions();
            }
        }
    }, [router]);

    const fetchTransactions = async () => {
        const adminToken = localStorage.getItem("adminToken");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions`, {
                headers: {
                    "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
                  },
            });
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0); // Set to start of the day
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999); // Set to end of the day

            const filtered = transactions.filter(txn => {
                const txnDate = new Date(txn.date_time);
                return txnDate >= startOfDay && txnDate <= endOfDay;
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(transactions); // Reset if no date is selected
        }
    };

    useEffect(() => {
        handleDateChange(selectedDate);
    }, [selectedDate]);

    // Custom tick formatter for the X-axis based on granularity
    const formatXAxis = (tickItem) => {
        const date = new Date(tickItem);
        return granularity === 'hours' ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className='text0 bg-white shadow-lg p-5 rounded-lg mb-10'>
            <div className='flex flex-row justify-between gap-0'>
                <h2 className="text-xl text3 mb-2">Transaction History</h2>

                <div className='flex flex-col gap-0 items-center justify-center mb-5'>
                    <span className='text0 text-sm text-gray-600'>Select date</span>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        placeholderText="Select Date"
                        className='text-center text-base border-2 rounded-lg text3' // Remove border
                        popperClassName="border-0" // Remove border from the popper
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <select
                        value={granularity}
                        onChange={(e) => setGranularity(e.target.value)}
                        className='border-2 rounded-lg p-1'
                    >
                        <option value="hours">Hours</option>
                        <option value="minutes">Minutes</option>
                    </select>
                </div>
            </div>

            {filteredData.length > 0 ? 
                (<ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date_time" tickFormatter={formatXAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {showRevenue ? (
                            <Line type="monotone" dataKey="total_amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        ) : (
                            <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
                        )}
                    </LineChart>
                </ResponsiveContainer>)
             : 
                (<div className='flex items-center justify-center'>
                    <span className='text0 text-xl text-center'>No recorded transactions for the given date!</span>
                </div>)
            }

        </div>
    );
};

export default InterDayTransactions;