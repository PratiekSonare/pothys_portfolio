"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = () => {

  const router = useRouter();

  return (
    <footer className="flex flex-row md:hidden max-w-screen bg-gray-900 p-5 text-[10px] justify-around items-center">

      <div className='flex flex-col justify-center items-center gap-10'>
        {/* main footer, pothys links */}
        <div className=''>
          <div className='grid grid-cols-[1fr_2fr_1fr] justify-around items-center space-x-5'>


            <div className='flex flex-col justify-center items-start gap-5'>
              {/* Pothys Store Links */}
              <div className="flex flex-col justify-start items-start text1 text-gray-400">
                <span className="text2 text-white tracking-tight">Pothys Store</span>
                <div className="my-0"></div>
                <button onClick={() => router.push("/")}>Home</button>
                <button onClick={() => router.push("/dow")}>Best Deals</button>
                <button onClick={() => router.push("/cart")}>Cart</button>
              </div>

              {/* Help and Contact Us Links */}
              <div className="flex flex-col items-start text1 text-gray-400">
                <span className="text2 text-white">Help</span>
                <div className="my-0"></div>
                <button onClick={() => router.push("/admin/admin-login")}>Admin Portal</button>
                <button onClick={() => router.push("/employee/emp-login")}>Employee Portal</button>
                <button onClick={() => router.push("/admin/admin-login")}>Contact Us</button>
                <button onClick={() => router.push("/admin/admin-login")}>About Us</button>
              </div>
            </div>


            <div className='flex flex-col justify-center items-center gap-5'>
              {/* Image and Social Icons */}
              <div className="flex flex-col items-center gap-2 max-w-xs flex-shrink-0">
                <img src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo.svg" style={{ width: '90%' }} alt="Logo" />
                <div className="flex flex-row items-center justify-center gap-5">
                  <img src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/google.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Google" />
                  <img src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/whatsapp.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="WhatsApp" />
                </div>
              </div>
              {/* seltel */}
              <div className='flex flex-col justify-center items-center -mb-2 text-[8px]'>
                <span className="text0 text-gray-500">Powered by</span>
                <img
                  src="https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/seltel-logo-web-light.svg"
                  className="w-[30%] -mt-1"
                ></img>
                <span className="text0 text-gray-500 -mt-1">© All rights reserved - 2025</span>
              </div>
            </div>


            <div className='flex flex-col justify-center items-end gap-5'>
              {/* Pothys Store Links */}
              <div className="flex flex-col justify-start items-end text1 text-gray-400">
                <span className="text2 text-white">Branch</span>
                <div className="my-0"></div>
                <button>Villupuram</button>
                <button>Koliyanur</button>
                <button>Puducherry</button>
              </div>

              {/* Help and Contact Us Links */}
              <div className="flex flex-col items-end text1 text-gray-400">
                <span className="text2 text-white">Visit Us</span>
                <div className="my-0"></div>

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.420538740364!2d72.91253117520677!3d19.13306048208331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7f189efc039%3A0x68fdcea4c5c5894e!2sIndian%20Institute%20of%20Technology%20Bombay!5e0!3m2!1sen!2sin!4v1743166793129!5m2!1sen!2sin"
                  style={{ width: '50px', height: '50px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className='rounded-lg'
                ></iframe>

              </div>
            </div>

          </div>
        </div>

      </div>

    </footer>
  )
}

export default Footer;