"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import '../../styles.css'
import Header from './Header';
import { useRouter } from 'next/navigation';
import AllTransaction from './AllTransaction';
import CashTransaction from './CashTransaction'
import UpiTransaction from './UpiTransaction'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import Daily from './chart/Daily'
import Monthly from './chart/Monthly'
import InterDay from './chart/InterDay'

const FinanceDashboard = () => {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]); // New state for monthly data
    const [showRevenue, setShowRevenue] = useState(true);
    const [newTransaction, setNewTransaction] = useState({
        cartItems: [],
        total_amount: 0,
        payment_method: 'UPI',
        customer: {
            customer_name: '',
            phone: '',
            address: ''
        },
        delivery_status: 'pending'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('date_time');
    const [sortOrder, setSortOrder] = useState('desc');
    const [dailyRevenue, setDailyRevenue] = useState({});
    const [timeFrame, setTimeFrame] = useState('daily'); // 'daily' or 'monthly'

    //date and time
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    // New state for date filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    //token
    const [token, setToken] = useState(null);

    //pending transactions
    const [pendingTransactions, setPendingTransactions] = useState([]);

    const prepareData = (transactions) => {
        const revenueData = {};

        transactions.forEach(txn => {
            const date = new Date(txn.date_time);
            const key = timeFrame === 'monthly' ?
                date.toLocaleString('default', { month: 'long', year: 'numeric' }) :
                date.toLocaleDateString('en-GB'); // Use 'en-GB' for dd/mm/yyyy format

            if (!revenueData[key]) {
                revenueData[key] = { total: 0, count: 0 };
            }
            revenueData[key].total += txn.total_amount;
            revenueData[key].count += 1;
        });

        const preparedData = Object.keys(revenueData).map(key => ({
            date: key,
            total: revenueData[key].total,
            count: revenueData[key].count,
            dateObject: new Date(key.split('/').reverse().join('-')), // Convert dd/mm/yyyy to yyyy-mm-dd for correct parsing
        }));

        // Sort the data in ascending order
        preparedData.sort((a, b) => a.dateObject - b.dateObject);

        return preparedData;
    };

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
        // const adminToken = localStorage.getItem("adminToken");
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

            // Prepare daily and monthly revenue data
            const dailyRevenue = {};
            const monthlyRevenue = {};

            response.data.transactions.forEach(txn => {
                const date = new Date(txn.date_time);
                const dailyKey = date.toLocaleDateString();
                const monthlyKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                // Daily data
                if (!dailyRevenue[dailyKey]) {
                    dailyRevenue[dailyKey] = { total: 0, count: 0 };
                }
                dailyRevenue[dailyKey].total += txn.total_amount;
                dailyRevenue[dailyKey].count += 1;

                // Monthly data
                if (!monthlyRevenue[monthlyKey]) {
                    monthlyRevenue[monthlyKey] = { total: 0, count: 0 };
                }
                monthlyRevenue[monthlyKey].total += txn.total_amount;
                monthlyRevenue[monthlyKey].count += 1;
            });

            // Convert dailyRevenue object to array
            const dailyArray = Object.keys(dailyRevenue).map(date => ({
                date,
                total: dailyRevenue[date].total,
                count: dailyRevenue[date].count,
            }));

            setDailyData(dailyArray);

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


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString(); // HH:MM:SS
      const formattedDate = now.toLocaleDateString(); // DD/MM/YYYY or MM/DD/YYYY based on locale

      setCurrentTime(`${formattedTime}`);
      setCurrentDate(`${formattedDate}`);
    };

    updateTime(); // Set initial value immediately
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

    const carousel_class = 'text3 text-2xl rounded-lg p-4 group border-2 border-blue-500 bg-transparent hover:bg-blue-500 hover:border-2'

    return (
        <>
            <header className="top-0 header-sdw">
                <Header />
            </header>

            <div className="container mx-auto p-2">

                <div className='flex flex-row justify-between items-center mt-10'>

                    <div className='flex flex-col'>
                        <span className='text-4xl text3'>Finance Dashboard</span>
                        <div className='bg-blue-500 rounded-lg self-start'><span className="text2 text-2xl font-bold mb-5 text-gray-300 px-3 py-2">Admin Access</span></div>
                    </div>
                    
                    <div className='flex flex-row items-start gap-5 mr-5'>
                        <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
                            <span className='text-lg text0 self-end text-green-300'>Time</span>
                            <span className='text-2xl text2'>{currentTime}</span>
                        </div>
                        <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
                            <span className='text-lg text0 self-end text-green-300'>Date</span>
                            <span className='text-2xl text2'>{currentDate}</span>
                        </div>
                    </div>

                </div>                


                <div className='grid grid-cols-2 grid-rows-1 space-x-5 items-center justify-center'>

                    {/* Monthly data chart */}
                    <Monthly />

                    {/* Daily data chart */}
                    <Daily />
                </div>

                {/* Inter data chart  */}
                <div className='-mt-5'><InterDay /></div>



                <div className='my-0'></div>

                {/* cash, upi and all transaction history and db  */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="mb-2">
                        <AccordionTrigger className={carousel_class}><span>All Transactions</span></AccordionTrigger>
                        <AccordionContent>
                            <AllTransaction />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="mb-2">
                        <AccordionTrigger className={carousel_class}>Cash Transactions</AccordionTrigger>
                        <AccordionContent>
                            <CashTransaction />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="mb-2">
                        <AccordionTrigger className={carousel_class}>Online (UPI) Transactions</AccordionTrigger>
                        <AccordionContent>
                            <UpiTransaction />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className='mb-10'></div>
        </>
    );
};

export default FinanceDashboard;