"use client"
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import '../styles.css';
import { useCart } from '../cart/CartContext';
import { LuSearch as Search } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

const SearchBar = ({ onFocus, onBlur }) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();

  const placeholders = [
    'Search for products...',
    'Search for \'Maggi\'...',
    'Search for \'ParleG\'...',
    'Search for \'Atta\'...',
    'Find your favorite items...',
    'Discover new products...',
    'What are you looking for?'
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const itemRefs = useRef([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/search?q=${encodeURIComponent(searchTerm)}`,
          {
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_TRANSACTION_API_KEY },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data.products)) {
          const mergedWithCart = data.products.map((product) => {
            const quantityType = `${product.quantity} ${product.unit}`;
            const cartItem = cartItems.find(
              (item) => item._id === product._id && item.quantityType === quantityType
            );

            return {
              ...product,
              numOrder: cartItem ? cartItem.numOrder : 0,
            };
          });

          setProducts(mergedWithCart);         // optional if you use it elsewhere
          setFilteredProducts(mergedWithCart); // ✅ use this for display
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    if (searchTerm.trim() !== '') {
      fetchProducts();
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    setFilteredProducts((prevFiltered) =>
      prevFiltered.map((product) => {
        const quantityType = `${product.quantity} ${product.unit}`;
        const cartItem = cartItems.find(
          (item) => item._id === product._id && item.quantityType === quantityType
        );
        return {
          ...product,
          numOrder: cartItem ? cartItem.numOrder : 0,
        };
      })
    );
  }, [cartItems]);


  // Loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      setAnimationClass('placeholder-animation'); // Trigger animation
    }, 1000); // Change every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    setCurrentPlaceholder(placeholders[placeholderIndex]);
  }, [placeholderIndex]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showDropdown || filteredProducts.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = (prev + 1) % filteredProducts.length;
          const ref = itemRefs.current[newIndex];
          if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return newIndex;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev === 0 ? filteredProducts.length - 1 : prev - 1;
          const ref = itemRefs.current[newIndex];
          if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return newIndex;
        });
      } else if (e.key === 'Enter') {
        if (selectedIndex !== -1) {
          const selectedProduct = filteredProducts[selectedIndex];
          const cartItem = cartItems.find(item => item._id === selectedProduct._id);

          if (!cartItem) {
            addToCart({
              ...selectedProduct,
              quantityType: `${selectedProduct?.quantity} ${selectedProduct?.unit}`
            });
          } else {
            incrementQ({
              ...selectedProduct,
              quantityType: `${selectedProduct?.quantity} ${selectedProduct?.unit}`
            });
          }
          setSearchTerm(""); // Optional: reset after selection
          setSelectedIndex(-1);
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredProducts, selectedIndex, cartItems, showDropdown]);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setSelectedIndex(-1); // Reset index
  };

  useEffect(() => {
    if (searchTerm) {
      setShowDropdown(true);
    } else {
      setTimeout(() => setShowDropdown(false), 500);
    }

    console.log('searchbar products: ', filteredProducts);
  }, [searchTerm]);

  return (
    <div className='hidden md:flex flex-col w-full searchbar-container'>

      <div className="flex bg-white card-sdw w-full h-10 rounded-lg overflow-hidden">

        {/* Search icon section */}
        <div
          role="button"
          onClick={() => {
            if (searchTerm.trim() !== '') {
              router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            }
          }}
          className={`flex items-center justify-center w-12 ${searchTerm.trim() !== '' ? "bg-red-500" : "bg-white"
            } transition-colors duration-200 ease-in-out cursor-pointer`}
        >
          <Search
            className={`${searchTerm.trim() !== '' ? "text-white" : "text-red-500"
              }`}
          />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm.trim() !== '') {
              router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            }
          }}
          className="flex-1 px-3 outline-none"
          placeholder="Search..."
        />
      </div>



      {showDropdown && (
        <div className={`filtered-results w-full bg-white mt-2 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50
     transition-transform duration-300 ease-out transform ${searchTerm ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <div className=''>
            <div className='bg-gray-300 p-1 text-black text-start text0'>
              <span className='ml-2'><span className='text-gray-700'>Showing results for</span> '{searchTerm}'</span>
            </div>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                const cartItem = cartItems.find(item => item._id === product._id);
                const quantity = cartItem ? cartItem.quantity : 1;
                itemRefs.current[index] = itemRefs.current[index] || React.createRef();

                return (
                  <React.Fragment key={product._id}>
                    <div
                      ref={itemRefs.current[index]}
                      className={`flex flex-row items-center gap-4 px-3 py-2 cursor-pointer ${selectedIndex === index ? 'bg-blue-100' : 'hover:bg-gray-200'
                        }`}
                    >
                      <img
                        src={product.imageURL}
                        alt='product_image'
                        style={{ width: '15%', height: 'auto' }}
                        className={`bg-transparent h-full w-full rounded-lg border-none text-lg text-black focus:outline-none ${animationClass}`}
                      />
                      <div className='flex flex-row items-center justify-between w-full text-md'>
                        <div className='flex flex-col gap-0'>
                          <div className='text-gray-600 text2 text-base'>{product.brand}</div>
                          <div className='text-black text1 text-lg'>{product.name}</div>
                        </div>
                        <div className='text1 text-base'>{product.quantity} {product.unit}</div>
                        <Separator orientation="vertical" />
                        <div className='flex flex-col items-center justify-center gap-1'>
                          <div className="flex items-end text1">
                            <p className="mr-2 text-xl text-gray-900 dark:text-white">
                              ₹{product.discount > 0 ? product.discounted_price : product.price}
                            </p>
                            {product.discount > 0 && (
                              <p className="text-md text-gray-500 line-through">₹{product.price}</p>
                            )}
                          </div>
                          {product.discount > 0 && <div className='bg-green-200 p-1 rounded-lg text-green-500'><span>{product.discount}% OFF</span></div>}
                        </div>

                        {!cartItem ? (
                          <button
                            onClick={() => {
                              addToCart({
                                ...product,
                                quantityType: `${product?.quantity} ${product?.unit}`
                              });
                            }}
                            className="text-center text-md w-1/5 h-[40px] rounded-lg bg-transparent border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                          >
                            <span className="font-bold transition-colors duration-300 ease-in-out">Add</span>
                          </button>
                        ) : (
                          <div className='flex flex-row gap-1 text-lg justify-center items-center rounded-lg w-1/5 h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 ease-in-out'>
                            <button onClick={() => decrementQ({
                              ...product,
                              quantityType: `${product?.quantity} ${product?.unit}`
                            })} className="w-1/3 h-full flex items-center justify-center">-</button>
                            <button className="w-1/3 h-full flex items-center justify-center">
                              <span className="font-bold">{product?.numOrder}</span>
                            </button>
                            <button onClick={() => incrementQ({
                              ...product,
                              quantityType: `${product?.quantity} ${product?.unit}`
                            })} className="w-1/3 h-full flex items-center justify-center">+</button>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < filteredProducts.length - 1 && <Separator orientation="horizontal" className="my-2" />}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="p-2 text-gray-500 text0">No products found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;