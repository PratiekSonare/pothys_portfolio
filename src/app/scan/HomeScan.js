import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import QRCodeScanner from "../admin/fastcart/QRCode"
import { useState } from "react"
import SearchBarParent from '../header/SearchBarParent'
import SearchBar from "./SearchBar"
import { useCart } from '@/app/cart/CartContext';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import '../styles.css'
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { LuQrCode as QrCode } from "react-icons/lu"

const HomeScan = () => {

  const { toast } = useToast(); // Ensure it's inside the component
  const [hsnInput, setHsnInput] = useState('');
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();
  const router = useRouter();

  const handleHsnChange = (e) => {
    setHsnInput(e.target.value);
  };

  const handleHsnSearch = async () => {
    if (!hsnInput.trim()) {
      alert("Please enter an HSN number.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/hsn/${hsnInput}`, {
        headers: {
          "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
        },
      });
      if (!response.ok) {
        throw new Error("Product not found");
      }

      const product = await response.json();
      console.log('Product with given HSN Number', product);

      // Ensure product is an object, not an array
      const selectedProduct = Array.isArray(product) ? product[0] : product;

      if (selectedProduct && selectedProduct.name) {
        addToCart({
          ...selectedProduct,
          quantityType: `${selectedProduct?.quantity} ${selectedProduct?.unit}`
        });

        // Show the toast notification
        toast({
          title: "Item Added to Cart",
          description: `${selectedProduct?.name} has been added to your cart.`,
          action: <ToastAction altText="View cart" onClick={() => router.push("/cart")}>View Cart</ToastAction>,
          className: 'bg-green-500 text0'
        });

        setHsnInput('');
        // alert(`Added ${selectedProduct.name} to cart.`);
      } else {
        alert("No product found with this HSN number.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleScan = async (scannedValue) => {

    setHsnInput(scannedValue);
    // Fetch the product corresponding to the scanned HSN number
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/hsn/${scannedValue}`, {
        headers: {
          "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch product data.");
      }
      const product = await response.json();

      // Ensure product is an object, not an array
      const selectedProduct = Array.isArray(product) ? product[0] : product;


      if (selectedProduct && selectedProduct.name) {
        addToCart({
          ...selectedProduct, // Assuming you want to add the first product found
          quantityType: `${selectedProduct?.quantity} ${selectedProduct?.unit}`
        });

        // Show the toast notification
        toast({
          title: "Item Added to Cart",
          description: `${selectedProduct?.name} has been added to your cart.`,
          action: <ToastAction altText="View cart" onClick={() => router.push("/cart")}>View Cart</ToastAction>,
          className: 'bg-green-500 text0'
        });
        // alert(`Added ${selectedProduct.name} to cart.`);
      } else {
        alert('No product found with this HSN number.');
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      alert(`Error fetching product data. Please try again. - ${error}`);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className='rounded-lg h-10 text3 p-3 md:p-3 group text-black border-2 border-red-300 bg-red-500 hover:bg-white hover:border-2 hover:border-red-500 card-sdw'>
          <QrCode className="text-white group-hover:text-red-500" />
          <span className="group-hover:text-red-500 text-white hidden md:visible">Quick Scan</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='z-[999]'>
        <SheetHeader>
          <SheetTitle className='text3 text-2xl'>Quick Scan</SheetTitle>
          <SheetDescription className='text0 text-sm'>
            Scan barcode or type HSN number to add products.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 mb-10">
          <Separator />
        </div>

        {/* manual addition of products */}
        <div className='border-2 border-gray-500 rounded-lg p-5 text0 mt-10 card-sdw bg-gray-200'>
          <span className='text3 text-base md:text-2xl'>Add Products Manually</span>
          <div className='grid grid-rows-1 md:grid-rows-2 gap-5 mt-2'>
            <div>
              <span className='text-sm md:text-base'>Search by HSN</span>
              <div className='flex flex-row space-x-2'>
                <Input
                  type="HSN"
                  placeholder="HSN"
                  className='bg-white searchbar-sdw'
                  value={hsnInput}
                  onChange={handleHsnChange}
                />
                <Button
                  type="submit"
                  onClick={handleHsnSearch}
                  className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out'
                >
                  Search
                </Button>
              </div>

            </div>

            {/* <SearchBarParent /> */}
            <SearchBar />
          </div>
        </div>

        <div className="my-10">
          <Separator />
        </div>

        <div className="border-2 border-gray-500 p-5 text0 rounded-lg card-sdw bg-gray-200">
          <div className='flex flex-col'>
            <span className='text3 text-xl md:text-2xl mb-5'>Scan QR/Barcode</span>
            <QRCodeScanner onScan={(value) => handleScan(value)} />
          </div>
        </div>


        <div className="my-10">
          <Separator />
        </div>

        <SheetFooter>
          <SheetClose asChild>

          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default HomeScan;
