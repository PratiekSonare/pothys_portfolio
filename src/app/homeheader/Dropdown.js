"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { LuChevronDown as ChevronDown } from "react-icons/lu";
import "@/app/styles.css";
import { useRouter } from "next/navigation";
import categoryMap from "../data/categoryMap";

const DropdownMenuDemo = () => {
  const router = useRouter();

  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[\s&]+/g, "-")         // space and & to hyphen
      .replace(/[,\/]+/g, "")          // remove commas, slashes
      .replace(/-+/g, "-")             // collapse multiple hyphens
      .replace(/^-|-$/g, "");          // trim leading/trailing hyphens

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
            className="rounded-lg h-10 text3 p-3 md:p-3 group text-gray-900 border-2 border-green-700 bg-green-500 hover:bg-white hover:text-green-500 hover:border-2 hover:border-green-500 card-sdw"
        >

          Shop by Category
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full ml-10 bg-gray-800 text-sm p-2 z-[150] text-white h-[500px]">
        <DropdownMenuGroup>
          <div className="flex flex-col space-y-2">
            {Object.entries(categoryMap).map(([category, subcategories], index) => (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger className="w-full p-2 text1 text-md border-0 text-green-500">
                  {category}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="ml-2 z-[150] bg-gray-200 text-gray-800 p-2 text1 text-md">
                    {subcategories.map((sub, subIndex) => (
                      <DropdownMenuItem
                        key={subIndex}
                        className="hover:bg-green-700 cursor-pointer"
                        onClick={() =>
                          router.push(`/category/${slugify(category)}/${slugify(sub)}`)
                        }
                      >
                        {sub}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuDemo;
