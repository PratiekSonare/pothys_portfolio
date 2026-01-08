"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

const Footer = () => {

  const router = useRouter();

  const categories = [
    { name: "Fruits and Vegetables", route: "/category/fv" },
    { name: "Beverages", route: "/category/beverages" },
    { name: "Daily Staples", route: "/category/ds" },
    { name: "Cleaning and Household", route: "/category/ch" },
    { name: "Beauty and Hygiene", route: "/category/bh" },
    { name: "Home and Kitchen", route: "/category/hk" },
    { name: "Oil and Masala", route: "/category/fom" },
    { name: "Eggs and Meat", route: "/category/emf" },
    { name: "Bakery and Dairy", route: "/category/bcd" },
    { name: "Snacks", route: "/category/snacks" },
  ]

  return (
    <footer className="hidden md:block max-w-screen bg-gray-900 p-10 text-lg border-t-[1px] border-gray-700">
      <div className='flex flex-col justify-center items-center gap-16'>

        {/* pothys and other info */}
        <div className="grid grid-cols-5 gap-5 px-10 w-full">

          <div className='flex flex-col gap-10 justify-start items-start'>
            {/* Pothys Store Links */}
            <div className="flex flex-col justify-start items-start text1 text-gray-400">
              <span className="text2 text-white">Pothys Store</span>
              <div className="my-2"></div>
              <button onClick={() => router.push("/")}>Home</button>
              <button onClick={() => router.push("/dow")}>Best Deals</button>
              <button onClick={() => router.push("/cart")}>Cart</button>
            </div>

            {/* Help and Contact Us Links */}
            <div className="flex flex-col items-start text1 text-gray-400">
              <span className="text2 text-white">Help</span>
              <div className="my-2"></div>
              <button onClick={() => router.push("/admin/admin-login")}>Admin Portal</button>
              <button onClick={() => router.push("/employee/emp-login")}>Employee Portal</button>
              <button onClick={() => router.push("/admin/admin-login")}>Contact Us</button>
              <button onClick={() => router.push("/admin/admin-login")}>About Us</button>
            </div>
          </div>

          {/* Shop by category */}
          <div className="flex flex-col justify-start items-start text1 text-gray-400">
            <span className="text2 text-white">Shop now</span>
            <div className="my-2"></div>
            {categories.map((content, index) =>
              <button key={index} onClick={() => router.push(`${content.route}`)}>{content.name}</button>
            )}
          </div>

          <div className='flex flex-col justify-around h-full'>
            {/* Image and Social Icons */}
            <div className="flex flex-col justify-center items-center gap-5 max-w-xs">
              <img src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo_header.svg" style={{ width: '80%' }} alt="Logo" />
              <div className="flex flex-col items-center justify-center gap-1">
                <span className='text1 text-sm md:text-base text-gray-500'>Contact us on</span>
                <img src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/whatsapp.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="WhatsApp" />
              </div>
            </div>

            {/* seltel  */}
            <div className='flex flex-col justify-center items-center'>
              <span className="text0 text-xs text-gray-500">Powered by</span>
              <img
                src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/seltel-logo-web-light.svg"
                className="w-[25%] my-2"
              ></img>
              <span className="text0 text-xs text-gray-500">© All rights reserved - 2025</span>
            </div>
          </div>

          {/* Branch */}
          <div className="flex flex-col items-end text1 text-gray-400">
            <span className="text2 text-white">Branch</span>
            <div className="my-2"></div>
            <button>Villupuram</button>
            <button>Koliyanur</button>
            <button>Puducherry</button>
          </div>

          {/* Map */}
          <div className="flex flex-col items-end text1 text-gray-400">
            <span className="text2 text-white">Visit Us</span>
            <div className="my-2"></div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.5963262688847!2d79.529066!3d11.9331563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5357036e2595f3%3A0xa6bc312546df880c!2sSK%20SUPER%20MARKET!5e0!3m2!1sen!2sin!4v1749443590369!5m2!1sen!2sin" style={{ width: '180px', height: '300px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className='rounded-lg'
            ></iframe>
          </div>

        </div>

        <div className='flex flex-col justify-center items-center -mt-10 -mb-5'>


        </div>

      </div>

    </footer>
  )
}

export default Footer;