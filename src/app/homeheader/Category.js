"use client"
import React, { useState } from 'react'
import Dropdown from './Dropdown'
import { Button } from '@/components/ui/button'
import ExtraDropDown from './ExtraDropDown'
import { useRouter } from 'next/navigation'

const Category = () => {
  
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const categories = [
    { name: "Fruits and Vegetables", route: "category/fruits-vegetables" },
    { name: "Beverages", route: "category/beverages" },
    { name: "Daily Staples", route: "category/ds" },
    { name: "Cleaning and Household", route: "category/ch" },
    { name: "Beauty and Hygiene", route: "category/bh" },
    { name: "Home and Kitchen", route: "category/hk" },
  ]

  const handleExtra = () => {
    setIsClicked((prev) => !prev)
  }

  return (
    <div className='flex flex-row justify-center items-center space-x-5 z-[150]'>

      <Dropdown />
{/* 
      <div className='flex flex-row items-center gap-5'>
        <div>
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={()=>router.push(`/${category.route}`)}
              className='text1 text-[15px] border-[1px] border-green-500 mx-1'>
                {category.name}
            </Button>
          ))}
        </div>

        <ExtraDropDown />
      </div> */}

          
    </div>
  )
}

export default Category