"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const ProductCard = ({ productVariants }) => {
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (productVariants.length > 0) {
      const itemInCart = cartItems.find(item => item.name === productVariants[0].name);
      const defaultVariant = itemInCart
        ? productVariants.find(variant => variant._id === itemInCart._id) || productVariants[0]
        : productVariants[0];

      setSelectedVariant(defaultVariant);
    }
  }, [productVariants, cartItems]);

  const handleVariantChange = (value) => {
    const variant = productVariants.find(v => v.quantity.toString() === value);
    setSelectedVariant(variant);
    setLoading(true); // Reset loading when a new variant is selected

  };

  const variant_discounted_price = (selectedVariant?.price * (1 - selectedVariant?.discount_lower / 100)).toFixed(2);
  const variant_price = selectedVariant?.price;

  return (
    <div className="w-full md:w-[260px] h-fit flex flex-col scale-[90%] md:scale-100 ">
      <div className="border hover:scale-105 hover:bg-gradient-to-r hover:from-green-100 hover:to-white transition-all duration-200 ease-in border-gray-400 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg flex flex-col h-full">
        <div className="relative flex flex-col justify-between">

          {/* IMAGE  */}
          <div className="flex justify-center items-center rounded-lg p-1">
            <div className="p-1 rounded-lg">
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

          {/* discount  */}
          {selectedVariant?.discount_lower > 0 && (
            <div className="absolute top-2 right-2 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
              {selectedVariant.discount_lower}% OFF
            </div>
          )}

          {/* CONTENT  */}
          <div className="flex flex-col justify-between p-4 flex-grow">
            {/* <div className="flex flex-col items- p-4"> */}

            {/* Top Content */}
            <div className="flex flex-col gap-1">
              {/* <h2 className="text-lg font-medium text-gray-600 dark:text-white truncate">{selectedVariant?.brand}</h2> */}

              {/* item name  */}
              <h2
                className="text0 text-md font-semibold dark:text-white text-gray-900 relative group overflow-hidden leading-snug line-clamp-2 h-[42px]"
                title={selectedVariant?.name}
              >
                {selectedVariant?.name?.length > 50
                  ? `${selectedVariant.name.slice(0, 50)}...`
                  : selectedVariant?.name}

                {/* Tooltip on hover */}
                <span className="absolute z-20 opacity-0 group-hover:opacity-100 bg-blue-600 text-white text-sm px-2 py-1 rounded-md transition-opacity duration-300 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none shadow-md">
                  {selectedVariant?.name}
                </span>
              </h2>

              <div className="flex items-end space-x-2 text3">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  ₹{selectedVariant?.discount_lower > 0 ? variant_discounted_price : variant_price}
                </p>
                {selectedVariant?.discount_lower > 0 && (
                  <p className="text-sm text-gray-500 line-through">₹{variant_price}</p>
                )}
              </div>

              {/* Variant Dropdown */}
              <div className="mt-2 text1">
                <Select onValueChange={handleVariantChange}>
                  <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
                    <span>{selectedVariant?.quantity} {selectedVariant?.unit}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {productVariants.map((variant) => (
                      <SelectItem key={variant._id} value={variant.quantity.toString()}>
                        <div className="flex flex-col w-ful text1">
                          <p>{variant.quantity} {variant.unit}</p>
                          <div className="flex items-center gap-2 text-sm">
                            {variant.discount_lower > 0 && (
                              <span className="text-xs bg-green-200 px-2 py-1 rounded-lg text-green-600">
                                {variant.discount_lower}% OFF
                              </span>
                            )}
                            <span>₹{variant.discounted_price || variant.price}</span>
                            {variant.discount_lower > 0 && (
                              <span className="line-through text-xs text-gray-500">₹{variant.price}</span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Add to Cart / Quantity Button */}
            <div className="flex-1/4 mt-4">
              {!cartItems.some(item => item._id === selectedVariant?._id) ? (
                <button
                  onClick={() => addToCart(selectedVariant)}
                  className="w-full h-[40px] text-md rounded-lg border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition"
                >
                  <span className="font-bold text2 text-base">Add</span>
                </button>
              ) : (
                <div className="flex justify-between items-center h-[40px] w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition">
                  <button onClick={() => decrementQ({ ...selectedVariant, quantityType: `${selectedVariant.quantity} ${selectedVariant.unit}` })} className="w-1/3 text-xl">-</button>
                  <span className="font-bold text2 text-base w-1/3 text-center">
                    {cartItems.find(item => item._id === selectedVariant?._id)?.numOrder || 1}
                  </span>
                  <button onClick={() => incrementQ({ ...selectedVariant, quantityType: `${selectedVariant.quantity} ${selectedVariant.unit}` })} className="w-1/3 text-xl">+</button>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

    </div >
  );
}

export default ProductCard;
