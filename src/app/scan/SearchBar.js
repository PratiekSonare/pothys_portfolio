"use client"
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import '../styles.css';
import { useCart } from '@/app/cart/CartContext';
import { Separator } from '@/components/ui/separator';

const SearchBar = ({ onFocus, onBlur }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();

  // Placeholder strings
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, {
          headers: {
            "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
          },
        });
        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`error: ${response.status}`);
        }
        const data = await response.json();
        console.log('the fetched data is:', data.products);

        // Check if data is an array
        if (data.products && data.products.length !== 0) {
          const availableData = data.products.filter(product => product.quantity > 0);
          setProducts(availableData);
          setFilteredProducts(availableData);
        } else {
          console.error('Expected data to be an array, but got:', data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      setAnimationClass('placeholder-animation'); // Trigger animation
      setCurrentPlaceholder(placeholders[placeholderIndex]);
    }, 1000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [placeholderIndex]);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchTerm(value);

    const regex = /(\D+)?(\d+)?/; // Matches optional text followed by optional number
    const match = value.match(regex);
    const productName = match[1] ? match[1].trim() : '';
    const quantityValue = match[2] ? Number(match[2]) : null;

    const filtered = products.filter(product => {
      const nameMatch = productName
        ? product.name.toLowerCase().includes(productName) || product.brand.toLowerCase().includes(productName)
        : true; // If no name is provided, don't filter by name

      const quantityMatch = quantityValue !== null
        ? product.quantity === quantityValue || product.quantity.toString().includes(quantityValue)
        : true; // If no quantity is provided, don't filter by quantity

      return nameMatch && quantityMatch;
    });

    setFilteredProducts(filtered);
  };

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

  useEffect(() => {
    if (searchTerm) {
      setShowDropdown(true);
    } else {
      setTimeout(() => setShowDropdown(false), 300); // Delay hiding to allow exit animation
    }
  }, [searchTerm]);


  return (
    <div className='hidden md:flex md:flex-col searchbar-container'>
      <span className='text0 text-base'>Search by name/brand</span>
      <div className='hidden md:flex flex-col searchbar-container'>
        <div className='flex bg-white searchbar-sdw w-full h-10 rounded-lg p-3'>
          <div className='flex flex-row items-center gap-5 w-full'>
            <img src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/searchicon.svg' alt='search_icon' style={{ height: '18px', width: '24px' }} />
            <input
              placeholder='Name/Brand'
              className='bg-transparent h-full w-full border-none text-base text-black focus:outline-none'
              onChange={handleChange}
              value={searchTerm}
            />
          </div>
        </div>

        {showDropdown && (
          <div className={`filtered-results w-full bg-white mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50
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
                        <div className='flex flex-row md:grid md:grid-cols-3 items-center justify-between w-full text-md'>
                          <div className='flex flex-col gap-0'>
                            <div className='text-gray-600 text2 text-base'>{product.brand}</div>
                            <div className='text-black text1 text-lg'>{product.name}</div>
                            <div className='text1 text-base'>{product.quantity} {product.unit}</div>
                          </div>

                          <div className='flex flex-col items-center justify-center gap-1 scale-[85%]'>
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
                              className="text-center text-md w-full h-[40px] rounded-lg bg-transparent border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                            >
                              <span className="font-bold transition-colors duration-300 ease-in-out">Add</span>
                            </button>
                          ) : (
                            <div className='flex flex-row gap-1 text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 ease-in-out'>
                              <button onClick={() => decrementQ({
                                ...product,
                                quantityType: `${product?.quantity} ${product?.unit}`
                              })} className="w-1/3 h-full flex items-center justify-center">-</button>
                              <button className="w-1/3 h-full flex items-center justify-center">
                                <span className="font-bold">{quantity}</span>
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
    </div>
  );
};

export default SearchBar;