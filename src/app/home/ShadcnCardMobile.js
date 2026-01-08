"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from '../cart/CartContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


export default function CarouselSize() {
  const { cartItems, selectedVar, addToCart, incrementQ, decrementQ } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [isVariantSelected, setIsVariantSelected] = useState(false); // New state to track variant selection

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/dow-true`,{
            headers: {
              "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
            },
          });
        setProducts(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Ensure loading is set to false even on error
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.name]) {
          acc[product.name] = [];
        }
        acc[product.name].push(product);
        return acc;
      }, {});
  
      const initialVariants = {};
      Object.keys(groupedProducts).forEach(productName => {
        const ItemsInCart = cartItems.find(item => item.name === productName);
  
        if (ItemsInCart) {
          initialVariants[productName] = {
            ...groupedProducts[productName].find(variant => variant._id === ItemsInCart._id) 
            || groupedProducts[productName][0], // Fallback to first variant if not found
            quantityType: `${ItemsInCart.quantity} ${ItemsInCart.unit}`
          };
        } else {
          const firstVariant = groupedProducts[productName][0];
          initialVariants[productName] = {
            ...firstVariant,
            quantityType: `${firstVariant.quantity} ${firstVariant.unit}`
          };
        }
      });
  
      setSelectedVariants(initialVariants);
    }
  }, [products, cartItems]); // Add cartItems dependency to ensure updates
  

  // Render loading state
  if (loading) {
    return <div className="flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>; // You can customize this loading state
  }

  return (
    <div className="relative w-full md:hidden block ml-0 md:ml-2">
      <Carousel opts={{ align: "start", slidesToScroll: 1 }} className="w-full h-full">
        <CarouselContent className="flex gap-4">
          {Object.keys(selectedVariants).map((productName) => {
            const productVariants = products.filter(product => product.name === productName);
            const cartItem = cartItems.find((item) => item.name === productName);
            const numOrder = cartItem ? cartItem.numOrder : 1;

            const selectedVariant = selectedVariants[productName];

            return (
              <CarouselItem key={productName} className="basis-11/12 md:basis-1/3 lg:basis-1/5 text1">
                <div className="rounded-lg bg-white  dark:bg-slate-800 shadow-md hover:shadow-lg overflow-auto">
                  <div className="relative flex flex-col">
                    <div className="flex justify-center items-center rounded-lg p-2">
                      <div className="border-gray-500 border-[1px] p-2 rounded-lg">
                      <img 
                        className="w-full object-cover rounded-lg" 
                        style={{ width: 'auto', height: '175px' }} 
                        src={selectedVariant?.imageURL} 
                        alt={selectedVariant?.name}
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                      />
                      </div>
                    </div>
                    {selectedVariant?.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
                        {selectedVariant.discount}% OFF
                      </div>
                    )}
                    <div className="p-4">
                    <h2 className="text2 text-lg dark:text-white text-gray-600">{selectedVariant?.brand}</h2>
                      
                      <h2
                        className="mb-2 text-lg dark:text-white text-gray-900 relative group"
                        title={productName} // Tooltip for accessibility
                      >
                        {productName.length > 18 ? `${productName.slice(0, 18)}...` : productName}
                        <span className="absolute opacity-0 group-hover:opacity-100 bg-blue-600 text-white text-sm px-2 py-1 rounded-md transition-opacity duration-300 -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          {productName}
                        </span>
                      </h2>             

                    <div className="flex items-end">
                        <p className="mr-2 text-xl text-gray-900 dark:text-white">
                          ₹{selectedVariant?.discount > 0 ? selectedVariant.discounted_price : selectedVariant?.price}
                        </p>
                        {selectedVariant?.discount > 0 && (
                          <p className="text-md text-gray-500 line-through">₹{selectedVariant.price}</p>
                        )}
                      </div>

                      <div className="mt-4 -mb-4">
                        <Select onValueChange={(value) => {
                          const variant = productVariants.find(v => v.quantity.toString() === value);
                          setSelectedVariants(prev => ({ ...prev, [productName]: variant }));
                          setIsVariantSelected(true); // Set to true when a variant is selected

                        }}>
                        <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
                          <span>{selectedVariants[productName]?.quantity} {selectedVariants[productName]?.unit}</span>
                        </SelectTrigger>
                          <SelectContent>
                          {productVariants.map((variant, index) => (
                          <div key={`${variant._id}`}>
                            <SelectItem className="" value={variant.quantity.toString()}>
                              <div className="flex flex-col space-y-1 w-full">
                                <p>{variant.quantity} {variant.unit}</p> 

                                <div className="flex flex-row justify-center items-center space-x-2">
                                  <div className="text-xs bg-green-200 p-1 rounded-lg text-green-500">
                                    <p>{variant.discount}% OFF</p>
                                  </div>
                                  <p className="text-sm">₹{variant.discount > 0 ? variant.discounted_price : variant.price}</p>
                                  <p className="text-xs items-end line-through">₹{variant.price}</p>
                                </div>
                              </div>
                            </SelectItem>

                            {/* ✅ Add Separator between items (except last one) */}
                            {index < productVariants.length - 1 && <Separator className="my-2" />}
                          </div>
                        ))}
                          </SelectContent>
                        </Select>
                      </div>

                    </div>
                  </div>

                  {!cartItem ? (
                    <div className="flex justify-center p-3">
                      <button
                        onClick={() => {
                          addToCart({
                            ...selectedVariant,
                            quantityType: `${selectedVariant?.quantity} ${selectedVariant?.unit}`,
                          });
                        }}
                        className="flex justify-center items-center p-2 text-md w-full h-[40px] rounded-lg border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition"
                      >
                        <span className="font-bold">Add</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center p-3 transition-opacity duration-500 ease-in-out opacity-100 text-lg">
                      <div className="flex flex-row h-[40px] justify-around w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300">
                        <button onClick={() => decrementQ({
                          ...selectedVariant,
                          quantityType: `${selectedVariant?.quantity} ${selectedVariant?.unit}`
                        })}> - </button>

                        <button>
                          <span className="font-bold">{numOrder}</span>
                        </button>

                        <button onClick={() => incrementQ({
                          ...selectedVariant,
                          quantityType: `${selectedVariant?.quantity} ${selectedVariant?.unit}`
                        })}> + </button>
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="flex justify-center items-center underline text1 mt-5 -mb-5">
          {/* <button>
            <span>View All</span>
          </button> */}
        </div>

      </Carousel>
    </div>
  );
}