// PendingDeliveries.js
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PendingDeliveries = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [sortField, setSortField] = useState('date_time');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure it's client-side
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        console.log("No token found, redirecting...");
        router.push("/admin/admin-login");
      } else {
        setToken(adminToken);
        // fetchTransactions(); // Fetch data only after token is set
        fetchPendingDelivery();
      }
    }
  }, [router]); // Run once when the component mounts

  useEffect(() => {
    if (token) {
      fetchPendingDelivery();
    }
  }, [token]);

  const fetchPendingDelivery = async () => {

    const adminToken = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions?delivery_status=pending`, {
        headers: {
          "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
        },
      });
      setPendingTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching pending transactions', error);
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const completeTransaction = async (transactionId) => {

    console.log('transaction_id received: ', transactionId);
    const adminToken = localStorage.getItem("adminToken");
    setLoading(true);
    
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions/${transactionId}`, {
        delivery_status: 'complete',
      }, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        }
      });
  
      // Remove from UI immediately
      setPendingTransactions((prev) => 
        prev.filter(txn => txn.transaction_id !== transactionId)
      );
  
      // alert(`Delivery complete with transaction_id: ${transactionId}`);
    } catch (error) {
      console.error('Error updating transaction status', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='p-24'>
      <span className='text0 text-3xl'>Pending Deliveries</span>
      <div className='h-1/3 overflow-y-scroll'>
        <Table className="w-full border border-gray-300 bg-white rounded-lg">
          <TableHeader className="bg-gray-200">
            <TableRow className='text2 text-md'>
              <TableHead className="p-2 border cursor-pointer" onClick={() => handleSort('transaction_id')}>
                <span>Transaction ID</span>
              </TableHead>
              <TableHead className="p-2 border cursor-pointer" onClick={() => handleSort('total_amount')}>
                <span>Total Amount</span>
              </TableHead>
              <TableHead className="p-2 border cursor-pointer" onClick={() => handleSort('payment_method')}>
                <span>Payment Method</span>
              </TableHead>
              <TableHead className="p-2 border cursor-pointer" onClick={() => handleSort('date_time')}>
                <span>Date</span>
              </TableHead>
              <TableHead className="p-2 border cursor-pointer" onClick={() => handleSort('customer_name')}>
                <span>Customer Name</span>
              </TableHead>
              <TableHead className="p-2 border cursor-pointer" onClick={() => handleSort('address')}>
                <span>Delivery Address</span>
              </TableHead>
              <TableHead className="p-2 border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingTransactions.map((txn) => (
              <TableRow key={txn.transaction_id}>
                <TableCell className="border p-2">{txn.transaction_id}</TableCell>
                <TableCell className="border p-2">₹ {txn.total_amount.toFixed(2)}</TableCell>
                <TableCell className="border p-2">{txn.payment_method}</TableCell>
                <TableCell className="border p-2">{new Date(txn.date_time).toLocaleString()}</TableCell>
                <TableCell className="border p-2">{txn.customer.customer_name}</TableCell>
                <TableCell className="border p-2">{txn.customer.address}</TableCell>
                <TableCell className="border p-2">
                  <Button
                    onClick={() => completeTransaction(txn.transaction_id)}
                    disabled={loading}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    {loading ? 'Completing...' : 'Complete'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingDeliveries;