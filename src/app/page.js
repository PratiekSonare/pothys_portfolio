"use client"
import React, { useState, useRef, useEffect } from "react";
import CategoryCardFv from "./home/fv/CategoryCard";
import CategoryCardBe from "./home/beverages/CategoryCard";
import CategoryCardSn from "./home/snacks/CategoryCard";
import CategoryCardCl from "./home/ch/CategoryCard";
import CategoryCardBh from "./home/bh/CategoryCard";
import CategoryCardHk from "./home/hk/CategoryCard";
import DOWImage from './home/image_carousel/DOWImage';
import DOWImageMobile from './home/image_carousel/DOWImageMobile';

import './styles.css';
import HeaderParent from "./homeheader/HeaderParent";
import FooterParent from "./footer/FooterParent";
import ShadcnCardParent from "./home/ShadcnCardParent";
import { LuChevronsDown as ChevronsDownIcon, LuChevronsUp as ChevronsUp } from "react-icons/lu";

export default function Home() {
  const targetRef = useRef(null);
  const headerRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleScrollTwo = () => {
    headerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowScrollButton(window.scrollY > 1000); // adjust 200 as needed
    };

    window.addEventListener('scroll', handleScrollVisibility);
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);

  return (
    <div className="overflow-x-hidden">

      <header className="top-0 w-full z-50 md:pb-10 bg-white header-sdw" ref={headerRef}>
        <HeaderParent />

        <div className="flex md:flex-col items-center gap-1 w-full md:px-20 md:mt-0 justify-center md:border-0 border border-t-4">
          <div className="flex flex-col gap-1 md:gap-2 items-center text-lg md:text-4xl my-2 md:mt-2 px-5">
            <span className="poppins-medium text-center"><span className="poppins-extrabold text-green-600">Shopping</span> made easy. <span className="poppins-extrabold text-green-600">Grocery</span> at your doorstep.</span>
            <span>Now at <span className="poppins-extrabold">Villupuram</span>!</span>
          </div>
        </div>

      </header>


      {showScrollButton && (
        <ChevronsUp
          className='transition transform active:scale-95 scale-105 border border-black cursor-pointer duration-100 ease-in-out md:bottom-10 md:right-10 bottom-5 right-5 fixed w-[35px] h-[35px] z-[200] md:w-[50px] md:h-[50px] p-2 bg-yellow-300 rounded-full'
          onClick={handleScrollTwo}
        />
      )}

      <div className="flex flex-col gap-0 items-center relative">
        <div className="md:block hidden -z-50 mt-2 shadow-xl">
          <DOWImage />
        </div>
        <div className="block md:hidden -z-50 mt-2">
          <DOWImageMobile />
        </div>

        <button className="md:block hidden" onClick={handleScroll}><ChevronsDownIcon className="absolute bottom-5 text-gray-500 hover:text-black" style={{ width: "60px", height: "60px" }} /></button>
        <button className="block md:hidden" onClick={handleScroll}><ChevronsDownIcon className="absolute bottom-5 text-gray-500 hover:text-black" style={{ width: "30px", height: "30px" }} /></button>
      </div>

      <div className={isSearchFocused ? 'blur' : ''}>



        {/* <div><ArrowBigDownDashIcon/></div> */}
        <section ref={targetRef}>
          <div className="p-5 md:pt-10 md:px-28 z-0">

            <div className="flex flex-col rounded-lg px-5 mx-5 py-5">
              <img className="w-full md:w-[50%] flex self-center md:self-center" alt="" src={'https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/dow_banner.avif'}></img>
              <div className="mb-5 mt-2">
                <ShadcnCardParent />
              </div>
            </div>

          </div>
        </section>

        <div className="my-10 flex flex-col items-center gap-5">
          {[CategoryCardFv, CategoryCardBe, CategoryCardSn, CategoryCardCl, CategoryCardBh, CategoryCardHk].map((Component, idx) => (
            <div key={idx} className="w-full flex justify-center">
              <div className="w-full max-w-full p-0 px-5 md:-py-5 md:px-44">
                <Component />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 mb-20" />

        <div className="p-5 md:py-5 md:px-40 text-center bg-gray-900 home-end-sdw pb-10 rounded-t-3xl md:rounded-t-full">
          <div className="flex flex-col md:flex-row justify-center md:gap-28 md:my-10">
            <div className="">
              <div className="flex flex-col center text-gray-400">
                <span className="text-xl md:text-3xl text3 md:text-center text-center text-white">Established in 2024</span>
                <div className="my-1 md:my-3"></div>
                <span className="text-lg/6 md:text-3xl text1 md:text-center text-center">SK Super Mart has served more than <span className="text-3xl md:text-[75px] text2 md:mx-5 text-green-600">500+</span> customers across <span className="text2 text-green-700">Villupuram</span>!</span>
                <div className="my-4"></div>
                <span className="text-xl md:text-5xl text1 md:text-center text-white text-center">Customter's <span className="text2">trust</span>, our <span className="text2">commitment</span>! </span>
              </div>
            </div>

          </div>

        </div>

      </div>


      <footer className="w-full">
        <FooterParent />
      </footer>
    </div>

  );
}
