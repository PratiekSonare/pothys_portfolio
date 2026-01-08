"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Assuming you're using Next.js
import '../../styles.css'
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            full_name: '',
            phone: '',
            aadhar: '',
            address: '',
            branch: '',
            username: '',
            password: '',
            // tran_succ: Number,
            // verification: '',
        },
    });

    const handleEmpReg = async (data) => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/emp/reg`, {
                ...data,
                verification: "pending"
            });

            // Assuming the response contains the token directly
            // localStorage.setItem("empToken", response.data.token);
            setShowPopup(true);
            alert('Employee registration successful! Please verify from administrator.')
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (err) {
            console.error("Login error:", err);
            // Display specific error message from the server
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    }

    return (
        <>
            <div className=" p-24 flex flex-col items-center justify-center min-h-screen bg-gray-100 text0">

                <div className="p-10 grid grid-cols-2 space-x-5 bg-white rounded-lg bg-dotted-emp border-green-500 border-4">

                    <div className="flex flex-col items-center justify-center">
                        <img
                            src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo.svg"
                            className="w-[35%] mb-5"
                        ></img>

                        <span className="text0 text-xs text-gray-600">Powered by</span>
                        <img
                            src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/seltel-logo-web.svg"
                            className="w-[10%] mt-2"
                        ></img>
                    </div>

                    <div className="bg-white p-10 card-sdw border-green-500 border-4 w-full text-black rounded-lg">

                        <h2 className="text-2xl font-bold mb-4">Employee Login</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className='space-y-5 text0 w-11/12 md:w-full md:block md:mt-10'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmpReg)} className='space-y-5 text0'>
                                    <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                                        {/* First Row */}
                                        <div className='md:col-span-2'>
                                            <FormField
                                                control={form.control}
                                                name="full_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Full Name" required {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className='md:col-span-2'>
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
                                        </div>
                                    </div>

                                    {/* Second Row */}
                                    <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                                        <div className='md:col-span-4'>
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Home Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="403, Shanti Niketan, Puducherry - 400000" required {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className='md:col-span-2'>
                                            <FormField
                                                control={form.control}
                                                name="aadhar"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Identification ID</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Aadhar ID" required {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className='md:col-span-2'>
                                            <FormField
                                                control={form.control}
                                                name="branch"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Branch</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Branch Name" required {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Third Row */}
                                    <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                                        <div className='md:col-span-2'>
                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Username</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Username" required {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className='md:col-span-2'>
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="Password" required {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-row justify-between">
                                        <Button
                                            className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 ease-in-out'
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : 'Register'}
                                        </Button>

                                        <div className="flex flex-col -space-y-1">
                                            <span className="text2 text-gray-700 self-start">Note:</span>
                                            <span className="text2 text-gray-500 self-center">Username and Password will be used for login.</span>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>

                    </div>
                </div>

                {/* Popup Notification */}
                {showPopup && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg transition-opacity duration-300">
                        Login successful! Redirecting...
                    </div>
                )}


            </div>

        </>
    );
}