'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import HeaderParent from '../cart/HeaderParent';
import FilterParent from '../category/FilterParent';
import NoItem from '../category/NoItem';
import ProductCard from '../category/ProductCard';
import FooterParent from '../footer/FooterParent';

const SearchResultsClient = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDiscounts, setSelectedDiscounts] = useState({
        fiftyPercent: false,
        thirtyPercent: false,
        dealOfTheWeek: false,
    });

    const handleDiscountChange = (type) => {
        setSelectedDiscounts(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const filteredProducts = products.filter(product => {
        const meetsFifty = selectedDiscounts.fiftyPercent ? product.discount >= 50 : true;
        const meetsThirty = selectedDiscounts.thirtyPercent ? product.discount >= 30 : true;
        const meetsDOW = selectedDiscounts.dealOfTheWeek ? product.dow === true : true;
        return meetsFifty && meetsThirty && meetsDOW;
    });

    const groupedProducts = filteredProducts.reduce((acc, item) => {
        if (!acc[item.name]) acc[item.name] = [];
        acc[item.name].push(item);
        return acc;
    }, {});

    useEffect(() => {
        const fetchData = async () => {
            if (!query) return;
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/search?q=${query}`, {
                    headers: {
                        'x-api-key': process.env.NEXT_PUBLIC_TRANSACTION_API_KEY
                    }
                });
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    return (
        <div className="overflow-x-hidden w-screen">
            <header className="top-0 header-sdw w-full">
                <HeaderParent />
            </header>

            <div className="my-5 md:my-20" />

            <div className="min-h-screen flex flex-col">
                <div className="flex-grow">
                    <div className="flex flex-col px-5 md:grid md:grid-cols-[1fr_4fr] md:px-20 md:space-x-10">
                        <FilterParent
                            selectedDiscounts={selectedDiscounts}
                            handleDiscountChange={handleDiscountChange}
                        />

                        <div>
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin" />
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <NoItem />
                            ) : (
                                <div className="container mx-auto">
                                    <h2 className="text2 text-2xl md:text-3xl font-bold mb-4 capitalize">
                                        {query ? `Search results for "${query}"` : 'All Products'}
                                    </h2>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
                                        {Object.keys(groupedProducts).map(name => (
                                            <ProductCard key={name} productVariants={groupedProducts[name]} />
                                        ))}
                                    </div>  
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="my-20" />
                <FooterParent />
            </div>
        </div>
    );
};

export default SearchResultsClient;
