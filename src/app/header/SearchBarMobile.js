import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { useState, useEffect } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/search?q=${searchTerm}`, {
          headers: { 'x-api-key': process.env.NEXT_PUBLIC_TRANSACTION_API_KEY }
        });

        if (!response.ok) {
          throw new Error(`error: ${response.status}`);
        }

        const data = await response.json();

        if (data.products && data.products.length !== 0) {
          // ✅ Merge cart data with fetched products
          const availableData = data.products.filter(product => product);

          const mergedWithCart = availableData.map((product) => {
            const quantityType = `${product.quantity} ${product.unit}`;
            const cartItem = cartItems.find(
              (item) => item._id === product._id && item.quantityType === quantityType
            );

            return {
              ...product,
              numOrder: cartItem ? cartItem.numOrder : 0,
            };
          });

          setProducts(mergedWithCart);
          setFilteredProducts(mergedWithCart); // ✅ initial filter can be the full list
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
    }
  }, [searchTerm, cartItems]); // include cartItems to keep `numOrder` up to date



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
        : true;

      const quantityMatch = quantityValue !== null
        ? product.quantity === quantityValue || product.quantity.toString().includes(quantityValue)
        : true;

      return nameMatch && quantityMatch;
    });

    setFilteredProducts(filtered); // `filtered` already contains `numOrder` field
  };

  useEffect(() => {
    setFilteredProducts((prev) =>
      prev.map((product) => {
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


  useEffect(() => {
    if (searchTerm) {
      setShowDropdown(true);
    } else {
      setTimeout(() => setShowDropdown(false), 500);
    }
  }, [searchTerm]);

  return (
    <div className='flex md:hidden flex-col w-full searchbar-container relative'>
      <div className="flex bg-white card-sdw w-full h-10 rounded-lg overflow-hidden ">
        {/* Search icon section */}
        <div className={`flex items-center justify-center w-7 p-1 ${searchTerm.trim() !== '' ? "bg-red-500" : "bg-white"} transition-colors duration-200 ease-in-out`}>
          <Search
            onClick={() => { router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`); }}
            className={`${searchTerm.trim() !== '' ? "text-white" : "text-red-500"} scale-90`}
            style={{width: '25px', height: '25px'}} />
        </div>

        {/* Input section */}
        <div className="flex flex-1 items-center ml-2">
          <input
            placeholder={currentPlaceholder}
            className="bg-transparent h-full w-full border-none text-xs text-black focus:outline-none"
            onChange={handleChange}
            value={searchTerm}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>

      {searchTerm && (
        <div className="filtered-results w-[60vw] max-w-[600px] mr-auto bg-white mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          <div className=''>
            <div className='bg-gray-300 p-1 text-black text-start text0'>
              <span className='ml-2'><span className='text-gray-700'>Showing results for</span> '{searchTerm}'</span>
            </div>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                const cartItem = cartItems.find(item => item._id === product._id);
                const quantity = cartItem ? cartItem.quantity : 1;

                return (
                  <React.Fragment key={product._id}>
                    <div className='flex flex-row items-center gap-2 hover:bg-gray-200 cursor-pointer px-2 py-1'>
                      <img
                        src={product.imageURL}
                        alt='product_image'
                        style={{ width: '15%', height: 'auto' }}
                        className={`bg-transparent h-full w-full rounded-lg border-none text-lg text-black focus:outline-none ${animationClass}`}
                      />

                      <div className='grid grid-cols-[1fr_1fr_2fr] items-center space-x-2 w-full text-xs'>

                        <div className='flex flex-col gap-1'>
                          {/* <div className='text-gray-600 text2 text-xs'>{product.brand}</div> */}
                          <div className='text-black text1'>{product.name}</div>
                          <div className='text1 text-xs'>{product.quantity} {product.unit}</div>
                        </div>

                        {/* <Separator orientation="vertical" /> */}

                        <div className='flex flex-col items-center justify-center gap-1 text-[10px]'>
                          <div className="flex flex-col items-center text1">
                            <p className="text-[15px] text-gray-900 dark:text-white">
                              ₹{product.discount > 0 ? product.discounted_price : product.price}
                            </p>
                            {product.discount > 0 && (
                              <p className=" text-gray-500 line-through">₹{product.price}</p>
                            )}
                          </div>
                          {product.discount > 0 && <div className='bg-green-200 p-0.5 text-center rounded-lg text-green-500'><span>{product.discount}% OFF</span></div>}
                        </div>

                        {!cartItem ? (
                          <button
                            onClick={() => {
                              addToCart({
                                ...product,
                                quantityType: `${product?.quantity} ${product?.unit}`
                              });
                            }}
                            className="text-center text-md w-11/12 h-[30px] rounded-lg bg-transparent border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-200 ease-in-out"
                          >
                            <span className="font-bold transition-colors duration-300 ease-in-out">Add</span>
                          </button>
                        ) : (
                          <div className='flex flex-row gap-0 text-lg justify-center items-center rounded-lg w-11/12 h-[30px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 ease-in-out'>
                            <button onClick={() => decrementQ({
                              ...product,
                              quantityType: `${product?.quantity} ${product?.unit}`
                            })} className="w-1/3 h-full flex items-center justify-center">-</button>
                            <button className="w-1/3 h-full flex items-center justify-center">
                              <span className="font-bold text2">{product.numOrder}</span>
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