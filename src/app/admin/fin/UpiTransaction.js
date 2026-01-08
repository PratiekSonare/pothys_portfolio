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
                // fetchPendingDelivery();
            }
        }
    }, [router]); // Run once when the component mounts

    const fetchTransactions = async () => {

        const adminToken = localStorage.getItem("adminToken");
        console.log(`backend link detecting:`, process.env.NEXT_PUBLIC_BACKEND_LINK);
        // console.log("Admin Token in Frontend:", adminToken);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions`, {
                headers: {
                    "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
                },
                params: {
                    payment_method: "UPI"
                }
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
                </div>
            </div>


            <span className='text0 text-lg text-gray-600'>Click on the header for sorting:</span>
            {/* Transactions Table */}
            <div className='h-1/3 overflow-y-scroll'>
                <Table className="w-full border border-gray-300 bg-white rounded-lg">
                    <TableHeader className="bg-gray-200">
                        <TableRow className='text2 text-md'>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('transaction_id')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Transaction ID</span>
                                    {sortField === 'transaction_id' && (sortOrder === 'asc' ? (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                    ) : (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                    ))}
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('total_amount')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Total Amount</span>
                                    {sortField === 'total_amount' && (sortOrder === 'asc' ? (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                    ) : (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                    ))}
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '50px' }} onClick={() => handleSort('payment_method')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Payment Method</span>
                                    {sortField === 'payment_method' && (sortOrder === 'asc' ? (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                    ) : (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                    ))}
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('date_time')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Date</span>
                                    {sortField === 'date_time' && (sortOrder === 'asc' ? (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                    ) : (
                                        <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                    ))}
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '100px' }} onClick={() => handleSort('date_time')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Customer Name</span>
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('date_time')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Delivery Address</span>
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border" style={{ width: '10px' }} >Customer Info</TableHead>
                            <TableHead className="p-2 border" style={{ width: '10px' }} >Cart Items</TableHead>
                            <TableHead className="p-2 border" style={{ width: '10px' }} >Delivery</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.map((txn) => (
                            <TableRow key={txn.transaction_id}>
                                <TableCell className="border p-2">{txn.transaction_id}</TableCell>
                                <TableCell className="border p-2">₹ {txn.total_amount.toFixed(2)}</TableCell>
                                <TableCell className="border p-2">{txn.payment_method}</TableCell>
                                <TableCell className="border p-2">{new Date(txn.date_time).toLocaleString()}</TableCell>
                                <TableCell className="border p-2">{txn.customer.customer_name.toLocaleString()}</TableCell>
                                <TableCell className="border p-2">{txn.customer.address.toLocaleString()}</TableCell>
                                <TableCell className="border p-2">
                                    <Dialog>
                                        <DialogTrigger>
                                            <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/report.svg' style={{ width: '25%' }} alt='report'></img>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Customer Information</DialogTitle>
                                                <DialogDescription>
                                                    <li>Name: {txn.customer.customer_name}</li>
                                                    <li>Phone: {txn.customer.phone}</li>
                                                    <li>Address: {txn.customer.address}</li>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell className="border p-2">
                                    <Dialog>
                                        <DialogTrigger>
                                            <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/shoppingcart.svg' style={{ width: '60%' }} alt='report'></img>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Cart Items</DialogTitle>
                                                <DialogDescription>
                                                    {txn.cartItems.map(item => (
                                                        <li key={item._id}>
                                                            {item.name} - {item.quantity} x ₹{item.price.toFixed(2)}
                                                        </li>
                                                    ))}
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell className={`${txn.delivery_status === 'complete' ? 'bg-green-500' : 'bg-red-500'} text-white border p-2`}>
                                    {txn.delivery_status}
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