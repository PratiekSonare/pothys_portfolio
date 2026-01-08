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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/emp/login`, {
                username,
                password,
            });

            // Assuming the response contains the token directly
            localStorage.setItem("adminToken", response.data.token);
            setShowPopup(true);
            setTimeout(() => {
                router.push("/employee/home");
            }, 2000);
        } catch (err) {
            console.error("Login error:", err);
            // Display specific error message from the server
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    const form = useForm({
        defaultValues: {
            name: '',
            phone: '',
            aadhar: '',
            address: '',
            branch: '',
            username: '',
            password: '',
            empID: '',
            // tran_succ: Number,
            // verification: '',
        },
    });

    const handleEmpReg = () => {

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


                    <form onSubmit={handleLogin} className="bg-white p-10 card-sdw border-green-500 border-4 w-96 text-black rounded-lg">

                        <h2 className="text-2xl font-bold mb-4">Employee Login</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                            required
                        />
                        <button type="submit" className="text2 p-2 text-md rounded w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out">
                            Login
                        </button>
                        <div className="my-2"></div>
                        <button
                        // type="submit"
                        onClick={() => router.push('/employee/emp-reg')}
                        className="text2 p-2 text-md rounded w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 ease-in-out">
                        Register New Employee
                    </button>
                    </form>
                    


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