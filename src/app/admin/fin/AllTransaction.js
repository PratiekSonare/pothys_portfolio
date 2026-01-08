"use client"
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
// import PendingDelivery from '../delivery/page'
import { LuCircleUserRound as CircleUserRound, LuTableProperties as TableProperties } from 'react-icons/lu';

const AllTransaction = () => {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [dailyData, setDailyData] = useState([]);
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
                setToken(adminToken);
                fetchTransactions(); // Fetch data only after token is set
                fetchPendingDelivery();
            }
        }
    }, [router]); // Run once when the component mounts

    const fetchTransactions = async () => {

        const adminToken = localStorage.getItem("adminToken");
        console.log(`backend link detecting:`, process.env.NEXT_PUBLIC_BACKEND_LINK);
        console.log("Admin Token in Frontend:", adminToken);

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

            // Calculate monthly revenue
            const currentMonth = new Date().getMonth();
            const monthlyRevenue = response.data.transactions.reduce((total, txn) => {
                const txnDate = new Date(txn.date_time);
                return txnDate.getMonth() === currentMonth ? total + txn.total_amount : total;
            }, 0);
            setMonthlyRevenue(monthlyRevenue);

            // Prepare daily revenue data
            const dailyRevenue = {};
            response.data.transactions.forEach(txn => {
                const date = new Date(txn.date_time).toLocaleDateString();
                if (!dailyRevenue[date]) {
                    dailyRevenue[date] = { total: 0, count: 0 };
                }
                dailyRevenue[date].total += txn.total_amount;
                dailyRevenue[date].count += 1;
            });

            // Set dailyRevenue state
            setDailyRevenue(dailyRevenue);

            // Convert dailyRevenue object to array
            const dailyArray = Object.keys(dailyRevenue).map(date => ({
                date,
                total: dailyRevenue[date].total,
                count: dailyRevenue[date].count,
            }));

            setDailyData(dailyArray);

            // Prepare revenue data based on the selected time frame
            const preparedData = prepareData(response.data.transactions);
            setDailyData(preparedData);

        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchPendingDelivery = async () => {

        const adminToken = localStorage.getItem("adminToken");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions?delivery_status=pending`, {
                headers: {
                    "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
                },
            })

            setPendingTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching pending transactions', error);
        }
    }

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const filteredTransactions = transactions
        .filter(txn => {
            const txnDate = new Date(txn.date_time);
            const isWithinDateRange = (!startDate || txnDate >= new Date(startDate)) && (!endDate || txnDate <= new Date(endDate));
            return (
                (txn.customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
                isWithinDateRange
            );
        })
        .sort((a, b) => {
            const aValue = sortField === 'date_time' ? new Date(a.date_time) : a[sortField];
            const bValue = sortField === 'date_time' ? new Date(b.date_time) : b[sortField];
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

    const currentDate = new Date().toLocaleDateString();
    const todayRevenue = dailyRevenue[currentDate] ? dailyRevenue[currentDate].total : 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Function to convert transactions to CSV
    const exportToCSV = () => {
        const csvRows = [];
        const headers = ['Transaction ID', 'Total Amount', 'Payment Method', 'Date', 'Customer Name', 'Delivery Address'];
        csvRows.push(headers.join(','));

        transactions.forEach(txn => {
            const row = [
                txn.transaction_id,
                txn.total_amount.toFixed(2),
                txn.payment_method,
                new Date(txn.date_time).toLocaleString(),
                txn.customer.customer_name,
                txn.customer.address,
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'transactions.csv');
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className=''>
            {/* <h1 className='text2 text-2xl my-3'>Transactions</h1> */}

            {/* Search and Filter Section */}
            <div className='flex flex-row gap-2 items-center justify-between my-5'>
                <div className="flex flex-col items-start w-full">
                    <span className='text0 text-lg text-gray-600'>Filter:</span>
                    <input
                        type="text"
                        placeholder="Search by Customer Name or Transaction ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text0 border p-2 w-full text-base"
                    />
                </div>

                <div className="flex flex-row gap-2">
                    <div className='flex flex-col'>
                        <span className='text0 text-lg text-gray-600'>Start Date</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2"
                        />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text0 text-lg text-gray-600'>End Date</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2"
                        />
                    </div>

                    <button
                        onClick={exportToCSV}
                        className='w-[200] h-fit border-2 border-red-500 rounded-lg py-1 px-0 self-center'>
                        <div className='flex flex-row justify-center items-center gap-1'>
                            <img
                                src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/download.svg'
                                className='w-[10%]'
                            />
                            <span className='text0'>Export to CSV</span>
                        </div>
                    </button>

                </div>
            </div>


            <span className='text0 text-lg text-gray-600'>Click on the header for sorting:</span>
            {/* Transactions Table */}
            <div className='h-1/3 overflow-y-scroll'>
                <Table className="w-full border border-gray-300 bg-white rounded-lg text-sm">
                    <TableHeader className="bg-gray-200">
                        <TableRow className="text-gray-700 font-semibold">
                            {/* Transaction ID */}
                            <TableHead
                                className="p-2 border cursor-pointer w-[150px]"
                                onClick={() => handleSort('transaction_id')}
                            >
                                <div className="flex justify-between items-center">
                                    <span>Transaction ID</span>
                                    {sortField === 'transaction_id' && (
                                        <img
                                            src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg"
                                            alt={sortOrder}
                                            className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </div>
                            </TableHead>

                            {/* Total Amount */}
                            <TableHead
                                className="p-2 border cursor-pointer w-[150px]"
                                onClick={() => handleSort('total_amount')}
                            >
                                <div className="flex justify-between items-center">
                                    <span>Total Amount</span>
                                    {sortField === 'total_amount' && (
                                        <img
                                            src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg"
                                            alt={sortOrder}
                                            className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </div>
                            </TableHead>

                            {/* Payment Method */}
                            <TableHead
                                className="p-2 border cursor-pointer w-[120px]"
                                onClick={() => handleSort('payment_method')}
                            >
                                <div className="flex justify-between items-center">
                                    <span>Payment Method</span>
                                    {sortField === 'payment_method' && (
                                        <img
                                            src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg"
                                            alt={sortOrder}
                                            className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </div>
                            </TableHead>

                            {/* Date */}
                            <TableHead
                                className="p-2 border cursor-pointer w-[180px]"
                                onClick={() => handleSort('date_time')}
                            >
                                <div className="flex justify-between items-center">
                                    <span>Date</span>
                                    {sortField === 'date_time' && (
                                        <img
                                            src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg"
                                            alt={sortOrder}
                                            className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </div>
                            </TableHead>

                            {/* Customer Name */}
                            <TableHead className="p-2 border w-[180px]">Customer Name</TableHead>

                            {/* Delivery Address */}
                            <TableHead className="p-2 border w-[200px]">Delivery Address</TableHead>

                            {/* Customer Info */}
                            <TableHead className="p-2 border w-[60px] text-center">Info</TableHead>

                            {/* Cart Items */}
                            <TableHead className="p-2 border w-[60px] text-center">Cart</TableHead>

                            {/* View Bill */}
                            <TableHead className="p-2 border w-[60px] text-center">Bill</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredTransactions.map((txn) => (
                            <TableRow key={txn.transaction_id} className="hover:bg-gray-50 transition">
                                <TableCell className="border p-2">{txn.transaction_id}</TableCell>
                                <TableCell className="border p-2">₹ {txn.total_amount.toFixed(2)}</TableCell>
                                <TableCell className="border p-2">{txn.payment_method}</TableCell>
                                <TableCell className="border p-2">
                                    {new Date(txn.date_time).toLocaleString()}
                                </TableCell>
                                <TableCell className="border p-2">{txn.customer.customer_name}</TableCell>
                                <TableCell className="border p-2">{txn.customer.address}</TableCell>

                                {/* Customer Info Dialog */}
                                <TableCell className="border p-2 text-center">
                                    <Dialog>
                                        <DialogTrigger>
                                            <CircleUserRound className="text-blue-600 cursor-pointer" />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Customer Information</DialogTitle>
                                                <DialogDescription>
                                                    <ul className="space-y-1">
                                                        <li><strong>Name:</strong> {txn.customer.customer_name}</li>
                                                        <li><strong>Phone:</strong> {txn.customer.phone}</li>
                                                        <li><strong>Address:</strong> {txn.customer.address}</li>
                                                    </ul>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>

                                {/* Cart Items Dialog */}
                                <TableCell className="border p-2 text-center">
                                    <Dialog>
                                        <DialogTrigger>
                                            <img
                                                src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/shoppingcart.svg"
                                                alt="Cart"
                                                className="w-6 h-6 mx-auto cursor-pointer"
                                            />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Cart Items</DialogTitle>
                                                <DialogDescription>
                                                    <ul className="space-y-1">
                                                        {txn.cartItems.map((item) => (
                                                            <li key={item._id}>
                                                                {item.name} - {item.quantity} x ₹{item.price.toFixed(2)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>

                                {/* View Bill */}
                                <TableCell
                                    className="border p-2 text-center cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => router.push(`/invoice?transaction_id=${txn.transaction_id}`)}
                                >
                                    View
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

            <div className='my-20'></div>

        </div>
    )
}

export default AllTransaction