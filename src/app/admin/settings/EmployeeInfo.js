"use client"
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-select';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'

// Employee schema
// const employeeSchema = new mongoose.Schema({
//     full_name: String,
//     phone: Number,
//     aadhar: Number,
//     address: String,
//     branch: String,
//     username: String,
//     password: String,
//     empID: String,
//     succ_tran: Number,
//     verification: String,
// });


const EmployeeInfo = () => {

    const [employee, setEmployee] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();


    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it's client-side
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                console.log("No token found, redirecting...");
                router.push("/admin/admin-login");
            } else {
                fetchEmployeeData(); // Fetch data only after token is set
            }
        }
    }, [router]); // Run once when the component mounts


    const fetchEmployeeData = async () => {
        const adminToken = localStorage.getItem("adminToken");

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/employee`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                }
            });
            console.log('API respnse: ', response.data.employee)
            setEmployee(response.data.employee); // Assuming the response data is the employee object
        } catch (err) {
            setError(err.message || "An error occurred while fetching employee data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Employee state:', employee); // Log the employee state
    }, [employee]);

    const generateEmployeeID = async (employee) => {
        const adminToken = localStorage.getItem("adminToken");
    
        if (employee.verification !== 'verified') {
            alert("Please verify the employee before generating an ID.");
            return;
        }
    
        // Logic to generate a new employee ID
        const newEmpID = `EMP${Math.floor(Math.random() * 10000)}`; // Example ID generation logic
    
        try {
            await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/employee/${employee.username}`,
                {
                    empID: newEmpID,
                    verification: employee.verification, // Include verification status if needed
                },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                    },
                }
            );
            fetchEmployeeData(); // Refresh employee data
        } catch (err) {
            console.error(err);
            alert("An error occurred while generating the employee ID.");
        }
    };
    
    const verifyEmployee = async (employee) => {
        const adminToken = localStorage.getItem("adminToken");
    
        try {
            await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/employee/${employee.username}`,
                {
                    verification: 'verified',
                },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                    },
                }
            );
            fetchEmployeeData(); // Refresh employee data
        } catch (err) {
            console.error(err);
            alert("An error occurred while verifying the employee.");
        }
    };

    const deleteEmployee = async (employee) => {
        const adminToken = localStorage.getItem("adminToken");

        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/employee/${employee.username}`,{
                    headers: {
                        Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                    },
                });
                fetchEmployeeData(); // Refresh employee data
            } catch (err) {
                console.error(err);
                alert("An error occurred while deleting the employee.");
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className='px-24'>
            <span className='text3 text-3xl'>Employee Details</span>

            <div className='mt-10'></div>

            <div className='p-5 rounded-lg bg-white grid grid-cols-1 gap-4'>
                {employee.map((employee, index) => (
                    <div key={index} className='p-5 rounded-lg bg-white mb-4'>
                        {/* First Row: General Information */}
                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Full Name:</span>
                                <span className='text2 text-black text-lg'>{employee.full_name}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Phone:</span>
                                <span className='text2 text-black text-lg'>{employee.phone}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Aadhar:</span>
                                <span className='text2 text-black text-lg'>{employee.aadhar}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Address:</span>
                                <span className='text2 text-black text-lg'>{employee.address}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Branch:</span>
                                <span className='text2 text-black text-lg'>{employee.branch}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Employee ID:</span>
                                <span className='text2 text-black text-lg'>{employee.empID}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Successful Transactions:</span>
                                <span className='text2 text-black text-lg'>{employee.succ_tran}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Verification Status:</span>
                                <span className={`text2 text-black text-lg ${employee.verification === 'pending' ? 'text-red-500' : 'text-green-500'}`}>
                                    {employee.verification}
                                </span>
                            </div>
                        </div>

                        {/* Second Row: Username and Password */}
                        <div className='flex flex-row justify-evenly items-center mt-10'>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Username:</span>
                                <span className='text2 text-black text-lg'>{employee.username}</span>
                            </div>
                            <div className='flex flex-col gap-0'>
                                <span className='text0 text-gray-500 text-sm'>Password:</span>
                                <span className='text2 text-black text-lg'>{employee.password}</span>
                            </div>

                            <div className='flex flex-row gap-5'>
                                <Button
                                    onClick={() => generateEmployeeID(employee)}
                                    className='text0 flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out'
                                    type="submit"
    
                                >
                                    {'Generate Employee ID'}
                                </Button>
    
                                <Button
                                    onClick={() => verifyEmployee(employee)}
                                    className='text0 flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 ease-in-out'
                                    type="submit"
    
                                >
                                    {'Verify Employee'}
                                </Button>
    
                                <Button
                                    onClick={() => deleteEmployee(employee)}
                                    className='text0 flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 ease-in-out'
                                    type="submit"
    
                                >
                                    {'Delete Employee'}
                                </Button>
    
                                <Button
                                    className='text0 flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors duration-300 ease-in-out'
                                    type="submit"
    
                                >
                                    {'Employee Reward'}
                                </Button>
                            </div>

                        </div>

                    <div className='border-[1px] border-gray-200 mt-10 -mb-10 rounded-lg'></div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeInfo;