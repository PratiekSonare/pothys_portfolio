"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CarouselSize({product}) {

  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    setIsAdded(true); // Switch to quantity selector
  };

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      setIsAdded(false); // If quantity reaches 0, reset back to "Add" button
    }
  };

  return (
    <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg overflow-auto">
      <div className="relative flex flex-col">
        <img
          className="w-full object-cover"
          src="https://images.unsplash.com/photo-1674296115670-8f0e92b1fddb?auto=format&fit=crop&w=870&q=80"
          alt="Product"
        />
        <div className="absolute top-2 right-2 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
          {product.discount}% off
        </div>
        <div className="p-4">
        <h2 className="text2 text-xl dark:text-white text-gray-600">{product.brand}</h2>
        <h2 className="mb-2 text2 text-xl dark:text-white text-gray-900">{product.name}</h2>
          <div className="flex items-end">
            <p className="mr-2 text-xl text-gray-900 dark:text-white">
              ₹{product.discounted_price}
            </p>
            {product.discount && (
              <p className="text-md text-gray-500 line-through">₹{product.price}</p>
            )}
          </div>
          <Select>
            <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
              <SelectValue placeholder="Quantity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kg</SelectItem>
              <SelectItem value="litre">Litre</SelectItem>
              <SelectItem value="units">Units</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isAdded ? (
        <div className="flex justify-center items-center p-3">
          <button
            onClick={addToCart}
            className="p-1 text-md w-full h-[40px] rounded-lg border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition"
          >
            <span className="font-bold">Add</span>
          </button>
        </div>
      ) : (
          <div className="flex justify-center p-3 transition-opacity duration-500 ease-in-out opacity-100 text-lg">
            <div className="flex flex-row h-[40px] justify-around w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300">
            <button onClick={decrement}> - </button>
              <button>
                <span className="font-bold">{quantity}</span>
              </button>
            <button onClick={increment}> + </button>
          </div>
        </div>
      )}
    </div>
  );
}
