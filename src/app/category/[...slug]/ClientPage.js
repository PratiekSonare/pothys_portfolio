'use client';

import HeaderParent from '../HeaderParent';
import FooterParent from '../../footer/FooterParent';
import Filter from '../Filter';
import FilterMobile from '../FilterMobile';
import NoItem from '../NoItem';
import ProductCard from '../ProductCard';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useParams } from 'next/navigation';
import { LuChevronsUp as ChevronsUp, LuCircleArrowDown as CircleArrowDownIcon, LuSearch as Search } from 'react-icons/lu';
import slugsToTitleCategory from '../../data/slugsToTitleCategory';
import slugsToTitleSubCategory from '../../data/slugsToTitleSubCategory';

const ClientPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscounts, setSelectedDiscounts] = useState({
    fiftyPercent: false,
    thirtyPercent: false,
    dealOfTheWeek: false,
  });

  const isAnyFilterApplied = Object.values(selectedDiscounts).some(Boolean);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const targetRef = useRef(null);

  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const slugParts = params.slug || [];
  const categorySlug = slugParts[0] || null;
  const subcategorySlug = slugParts[1] || null;
  const searchQuery = searchParams.get('q') || null;

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');


  const fetchProducts = async (currentPage = 1, reset = false) => {
    try {
      const query = new URLSearchParams();

      if (categorySlug) query.append("category", categorySlug);
      if (subcategorySlug) query.append("subcategory", subcategorySlug);
      if (searchQuery) query.append("q", searchQuery);

      query.append("page", currentPage);
      query.append("limit", 20);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/search?${query.toString()}`
      );

      const fetched = Array.isArray(response.data.products) ? response.data.products : [];

      setProducts(prev => {
        if (reset) return fetched;
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueNew = fetched.filter(p => !existingIds.has(p._id));
        return [...prev, ...uniqueNew];
      });

      setHasMore(currentPage < response.data.totalPages);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };


  // Initial load + reset on filters
  useEffect(() => {
    console.log('primary title: ', invertedCategoryMap[categorySlug]);
    console.log('secondary title: ', invertedSubCategoryMap[subcategorySlug]);

    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchProducts(1, true);
  }, [categorySlug, subcategorySlug, searchQuery]);

  const handleDiscountChange = (type) => {
    setSelectedDiscounts(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    fetchProducts(nextPage);
  };

  const filteredProducts = products.filter(product => {
    const meetsFifty = selectedDiscounts.fiftyPercent ? product.discount_lower >= 20 : true;
    const meetsThirty = selectedDiscounts.thirtyPercent ? product.discount_lower >= 10 : true;
    const meetsDOW = selectedDiscounts.dealOfTheWeek ? product.dow === true : true;

    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchText.toLowerCase());

    return meetsFifty && meetsThirty && meetsDOW && matchesSearch;
  });


  let displayedProducts = [...filteredProducts];

  if (sortBy === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'discount') {
    displayedProducts.sort((a, b) => b.discount_lower - a.discount_lower);
  }

  const groupedProducts = displayedProducts.reduce((acc, item) => {
    const key = `${item.name.trim().toLowerCase()}__${item.brand.trim().toLowerCase()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});


  // Invert the maps for quick lookup from slug
  const invertedCategoryMap = Object.fromEntries(
    Object.entries(slugsToTitleCategory).map(([title, slug]) => [slug, title])
  );

  const invertedSubCategoryMap = Object.fromEntries(
    Object.entries(slugsToTitleSubCategory).map(([title, slug]) => [slug, title])
  );

  const primaryTitle = invertedCategoryMap[categorySlug];
  const secondaryTitle = invertedSubCategoryMap[subcategorySlug];


  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowScrollButton(window.scrollY > 200); // adjust 200 as needed
    };

    window.addEventListener('scroll', handleScrollVisibility);
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);


  return (
    <div className="overflow-x-hidden w-screen">
      <header className="top-0 header-sdw w-full" ref={targetRef}>
        <HeaderParent />
      </header>

      {showScrollButton && (
        <ChevronsUp
          className='transition transform active:scale-95 scale-105 border border-black cursor-pointer duration-100 ease-in-out md:bottom-10 md:right-10 bottom-5 right-5 fixed w-[35px] h-[35px] z-[200] md:w-[50px] md:h-[50px] p-2 bg-yellow-300 rounded-full'
          onClick={handleScroll}
        />
      )}

      <div className="my-5 md:my-20" />

      <div className="min-h-screen flex flex-col md:mx-32">
        <div className="flex-grow">
          <div className="flex flex-col px-5 md:grid md:grid-cols-[1fr_4fr] md:px-20 md:space-x-10">

            <div className='hidden md:block'>
              <Filter
                selectedDiscounts={selectedDiscounts}
                handleDiscountChange={handleDiscountChange}
              />
            </div>

            <div>
              <div className="container mx-auto">
                <div className="flex flex-col justify-center items-center w-full">

                  <h2 className={`text3 text-2xl md:text-3xl font-bold capitalize ${secondaryTitle ? 'mb-0' : 'mb-4'}`}>
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : primaryTitle ||
                      "All Products"}
                  </h2>

                  {secondaryTitle &&
                    <h2 className="text3 text-xl md:text-xl text-gray-500 font-bold mb-4 capitalize">
                      {secondaryTitle}
                    </h2>
                  }

                  {/* Search and Sort */}
                  <div className="flex flex-col md:flex-row md:justify-between items-center w-full gap-2 md:gap-4">

                    <div className="flex bg-white shadow-lg w-full h-fit rounded-lg overflow-hidden">
                      {/* Search icon section */}
                      <div
                        className={`flex items-center justify-center w-12 ${searchText.trim() !== '' ? "bg-red-500" : "bg-white"
                          } transition-colors duration-200 ease-in-out cursor-pointer`}
                      >
                        <Search
                          className={`${searchText.trim() !== '' ? "text-white" : "text-red-500"
                            }`}
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Search in this category..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="px-4 py-2 w-full shadow-sm outline-none"
                      />
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-2 py-2 border rounded-md shadow-lg bg-white text1"
                    >
                      <option value="">Sort By</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="discount">Highest Discount</option>
                      <option value="name">Name (A-Z)</option>
                    </select>

                    <FilterMobile
                      selectedDiscounts={selectedDiscounts}
                      handleDiscountChange={handleDiscountChange}
                    />
                  </div>

                </div>

                <div className='bg-gray-300 w-full h-[2px] my-5'></div>

                {/* Product Section */}
                <div className="min-h-[300px]">
                  {loading && products.length === 0 ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <NoItem />
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
                        {Object.entries(groupedProducts).map(([key, variants]) => (
                          <ProductCard key={key} productVariants={variants} />
                        ))}
                      </div>

                      {/* Lazy Load Button */}
                      {hasMore && (
                        <div className="flex justify-center my-10">
                          <button
                            onClick={handleLoadMore}
                            className="text-black scale-125 rounded hover:text-gray-500 transition disabled:opacity-50"
                            disabled={loading}
                          >
                            {!loading && <CircleArrowDownIcon />}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="my-20" />

      </div>
      <FooterParent />
    </div>
  );
};

export default ClientPage;
