"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LuChevronsRight as ChevronsRight } from "react-icons/lu"
import "@/app/styles.css"

const DropdownMenuDemo = () => {
  const [open, setOpen] = useState(false)

  const extracategories = [
    { name: "Oil and Masala", route: "/category/fom" },
    { name: "Eggs and Meat", route: "/category/emf" },
    { name: "Bakery and Dairy", route: "/category/bcd" },
    { name: "Snacks", route: "/category/snacks" },
  ]

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <ChevronsRight
            className={`scale-75 transition-transform duration-200 ease-in-out ${
              open ? "rotate-90" : ""
            }`}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-32 bg-white p-2 z-[150]">
        <DropdownMenuGroup className="text-[15px]">
          <div className="flex flex-col space-y-2">
            {extracategories.map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full text1 flex justify-center items-center border-[1px] border-green-500 bg-white"
              >
                <p>{category.name}</p>
              </Button>
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuDemo
