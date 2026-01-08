import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CatInv = ({ updateProduct, deleteProduct }) => {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('fruits-vegetables');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 20;

    const categories = [
        { name: "Apparel", slug: "apparel" },
        { name: "Baby Care", slug: "baby-care" },
        { name: "Bakery, Cakes & Dairy", slug: "bakery-cakes-dairy" },
        { name: "Beauty & Hygiene", slug: "beauty-hygiene" },
        { name: "Beverages", slug: "beverages" },
        { name: "Cleaning & Household", slug: "cleaning-household" },
        { name: "Eggs, Meat & Fish", slug: "eggs-meat-fish" },
        { name: "Electronics", slug: "electronics" },
        { name: "Fashion", slug: "fashion" },
        { name: "Foodgrains, Oil & Masala", slug: "foodgrains-oil-masala" },
        { name: "Fruits & Vegetables", slug: "fruits-vegetables" },
        { name: "Kitchen, Garden & Pets", slug: "kitchen-garden-pets" },
        { name: "Snacks & Branded Foods", slug: "snacks-branded-foods" },
    ];

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const encodedCategory = encodeURIComponent(selectedCategory);
                const url = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/category/${encodedCategory}`;
                
                const response = await axios.get(url, {
                    headers: {
                        'x-api-key': process.env.NEXT_PUBLIC_TRANSACTION_API_KEY,
                    },
                    params: {
                        page,
                        limit,
                        search: debouncedSearchTerm,
                    }
                });

                const productList = response.data.products || (Array.isArray(response.data) ? response.data : []);
                setProducts(productList);
                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, page, debouncedSearchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // reset to page 1 on search
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <>
            <div className="flex items-center gap-10 justify-center p-5 border">
                <span className='text2 text-lg'>Category-wise Inventory</span>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setPage(1); // reset page on category change
                    }}
                    className="border p-2 rounded text-black"
                >
                    {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <div className="flex-grow my-4 px-2 relative">
                    <input
                        type="text"
                        placeholder="Search by Name, Brand, or HSN"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border p-2 rounded w-full pr-10"
                    />
                    {searchTerm && searchTerm !== debouncedSearchTerm && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    {searchTerm && searchTerm === debouncedSearchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center gap-4 my-4">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="self-center text-lg">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}


            {/* Products Table */}
            <div className="overflow-x-auto" style={{ height: '1000px', overflowY: 'auto' }}>
                {loading ? (
                    <p className="text-center mt-4 text1 text-2xl">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="text-center mt-4 text-gray-500">No products found for this category.</p>
                ) : (
                    <table className="w-full border border-gray-300 rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">id</th>
                                <th className="p-2 border">Actions</th>
                                <th className="p-2 border">HSN</th>
                                <th className="p-2 border">Brand</th>
                                <th className="p-2 border">Image</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Dealer Price</th>
                                <th className="p-2 border">MRP</th>
                                <th className="p-2 border">Quantity</th>
                                <th className="p-2 border">Unit</th>
                                <th className="p-2 border">Num Units Ordered</th>
                                <th className="p-2 border">Stock Inventory</th>
                                <th className="p-2 border">Discount</th>
                                <th className="p-2 border">Lower Discount</th>
                                <th className="p-2 border">Higher Discount</th>
                                <th className="p-2 border">Product Feature</th>
                                <th className="p-2 border">Product Tags</th>
                                <th className="p-2 border">Availability</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border">SubCategory</th>
                                <th className="p-2 border">Batch</th>
                                <th className="p-2 border">Expiry</th>
                                <th className="p-2 border">Image URL</th>
                                <th className="p-2 border">DOW</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="p-2 border">{product._id}</td>
                                        <td className="p-2 border">
                                            <div className="flex flex-col space-y-2">
                                                <button onClick={() => updateProduct(product)} className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition">
                                                    Update/Edit
                                                </button>
                                                <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 border">{product.hsn}</td>
                                        <td className="p-2 border">{product.brand}</td>
                                        <td className="p-2 border"><img src={product.imageURL} alt="prod_image" className="w-full"></img></td>
                                        <td className="p-2 border">{product.name}</td>
                                        <td className="p-2 border">₹{product.dealer_price}</td>
                                        <td className="p-2 border">₹{product.price}</td>
                                        <td className="p-2 border">{product.quantity}</td>
                                        <td className="p-2 border">{product.unit}</td>
                                        <td className="p-2 border">{product.num_units_ordered}</td>
                                        <td className="p-2 border">{product.stock_inv}</td>
                                        <td className="p-2 border">{product.discount}%</td>
                                        <td className="p-2 border">{product.discount_lower}%</td>
                                        <td className="p-2 border">{product.discount_higher}%</td>
                                        <td className="p-2 border">{product.product_feature}</td>
                                        <td className="p-2 border">{product.product_tags}</td>
                                        <td className="p-2 border">{product.avail ? "✅ Available" : " ❌ Out of Stock"}</td>
                                        <td className="p-2 border">{product.category}</td>
                                        <td className="p-2 border">{product.subcategory}</td>
                                        <td className="p-2 border">{product.batchnum}</td>
                                        <td className="p-2 border">{product.expiry}</td>
                                        <td className="p-2 border">{product.imageURL}</td>
                                        <td className="p-2 border">{product.dow ? "Yes" : "No"}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default CatInv;
