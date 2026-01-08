"use client"
import React, { useState, useEffect } from 'react'
import HeaderParent from '../header/HeaderParent'
import '../../styles.css'
import { useRouter } from 'next/navigation'
// landing page for the admin, routes to other dashboards and activites
// employee list, store location, etc

const page = () => {

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

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

  const router = useRouter();

  const content = [
    {
      title: "Admin Settings",
      description: "Manage and edit admin users, settings",
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/admin-svgrepo-com.svg",
      routeTo: "/admin/settings",
    },
    {
      title: "Inventory Dashboard",
      description: "Checkout existing inventory, pending stock",
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/cart-shopping-fast.svg",
      routeTo: "/admin/inv",
    },
    {
      title: "Finances",
      description: "Look at daily, monthly revenue. Manage dyanmic pricing.",
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/american-dollar-cents.svg",
      routeTo: "/admin/fin",
    },
    {
      title: "Fast Cart",
      description: "For offline store transactions, add products and make offline transactions in seconds!",
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/rocket.svg",
      routeTo: "/admin/fastcart",
    },
    {
      title: "Product Analytics", //which product is fast moving, slow moving, rate of their transactions, best performing product in this week etc.
      // description: "Analyse fast-moving, slow-moving products in your inventory, restock inventory intelligently!",
      description: "Coming Soon!",
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/statistics.svg",
      routeTo: "/admin/product-analytics",
    },
    {
      title: "Activity Dashboard", //notifications, pending deliveries
      description: "Analyse user/admin activity across all interfaces in one touch.",
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/notebook.svg",
      routeTo: "/admin/activity",
    },
  ];

  return (
    <div className=''>

      <header className='top-0 header-sdw'>
        <HeaderParent />
      </header>

      <div className='my-10'></div>

      <div className='px-24 flex flex-row justify-between items-center'>
        <span className='text-4xl text3'>Welcome, admin.</span>
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

      <div className='my-16'></div>

      <div className='px-24'>

        <div className="grid grid-cols-3 gap-10 px-0">
          {content.map((content, index) => (
            <div
              key={index}
              onClick={() => router.push(content.routeTo)}
              className='cursor-pointer transform active:scale-95 scale-105 p-6 shadow-lg rounded-lg flex flex-col items-center gap-4 transition-all duration-300 ease-in-out
                 bg-transparent border-gray-300 border hover:bg-gradient-to-bl hover:from-blue-200 hover:to-blue-800 hover:border-0 group'>

              {/* Top logo SVG */}
              <img
                src={content.src}
                className='w-[15%] group-hover:filter group-hover:invert'
                alt="Logo"
              />

              {/* Bottom content */}
              <div className='flex flex-col items-center text-center'>
                <span className='text3 text-3xl font-semibold group-hover:text-white'>{content.title}</span>
                <span className='text0 text-base text-gray-600 group-hover:text-gray-200'>{content.description}</span>
              </div>

              {/* Optional downward arrow at bottom */}
              <img
                src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/arrow.svg'
                alt='Arrow'
                className='w-8 mt-2 transform rotate-90 transition-transform duration-300 group-hover:rotate-[270deg] group-hover:filter group-hover:invert'
              />

            </div>
          ))}
        </div>



      </div>

    </div>
  )
}

export default page