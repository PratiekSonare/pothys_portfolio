"use client"
import React, { useState } from 'react'
import Dropdown from './Dropdown'
import { Button } from '@/components/ui/button'
import ExtraDropDown from './ExtraDropDown'

const Category = () => {
  
  const [isClicked, setIsClicked] = useState(false);

  const categories = [
    { name: "Fruits and Vegetables", route: "/category/fv" },
    { name: "Beverages", route: "/category/beverages" },
    { name: "Daily Staples", route: "/category/ds" },
    { name: "Cleaning and Household", route: "/category/ch" },
    { name: "Beauty and Hygiene", route: "/category/bh" },
    { name: "Home and Kitchen", route: "/category/hk" },
  ]


  const handleExtra = () => {
    setIsClicked((prev) => !prev)
  }

  return (
    <div className='flex flex-row justify-center items-center space-x-5 '>

      <Dropdown />
          
    </div>
  )
}

export default Category