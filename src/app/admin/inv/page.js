"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ConfirmationPopup from '../ConfirmationPopup';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import Header from "../header/HeaderParent";
import '../../styles.css'
import { useToast } from "@/hooks/use-toast"
import CatInv from "./CatInv";
import ProductForm from "./ProductForm";

export default function AdminDashboard() {

    const formRef = useRef(null);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // State for confirmation popup
    const [actionType, setActionType] = useState(""); // To track the action type (add, update, delete)
    const [productIdToDelete, setProductIdToDelete] = useState(null); // To store the ID of the product to delete
    const [csvFile, setCsvFile] = useState([]); // State to store the uploaded CSV file
    const [showConfirmUpload, setShowConfirmUpload] = useState(false); // State to control the confirmation popup for CSV upload
    const [selectedProducts, setSelectedProducts] = useState([]); // State to track selected products for deletion
    const [token, setToken] = useState(null);
    const [isSearching, setIsSearching] = useState(false); // Loading state for search
    //date and time
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const productsPerPage = 20; // Set the number of products per page

    const [allProducts, setAllProducts] = useState([]); // New state to hold all products

    const { toast } = useToast(); // Ensure it's inside the component


    const handleScroll = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it's client-side
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                console.log("No token found, redirecting...");
                router.push("/admin/admin-login");
            } else {
                // console.log("Token found:", adminToken); 
                setToken(adminToken);
                fetchProducts(); // Fetch data only after token is set
            }
        }
    }, [router]); // Run once when the component mounts

    const fetchProducts = async (page = 1, search = "") => {
        try {
            setIsSearching(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, {
                headers: {
                    "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
                },
                params: {
                    page,
                    limit: productsPerPage,
                    search,
                },
            });

            setFilteredProducts(response.data.products);
            setAllProducts(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({
                title: "Error",
                description: "Failed to fetch products. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSearching(false);
        }
    };


    // Debounce search term to avoid excessive API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch products when debounced search term or page changes
    useEffect(() => {
        fetchProducts(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleProductAdded = () => {
        fetchProducts(currentPage, debouncedSearchTerm);
        setEditingProduct(null);
    };

    const handleProductUpdated = () => {
        fetchProducts(currentPage, debouncedSearchTerm);
        setEditingProduct(null);
        // Optional: Reload to ensure all state is fresh
        setTimeout(() => window.location.reload(), 500);
    };

    const updateProduct = (product) => {
        console.log("Editing Product:", product); // Debugging line
        setEditingProduct(product);

        handleScroll();
 
        toast({
            title: "Product to be updated...",
            description: `Please update product data using the form!`,
            className: 'bg-yellow-500 text0'
        });
    };

    const deleteProduct = async (id) => {
        setProductIdToDelete(id);
        setActionType("delete");
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        const adminToken = localStorage.getItem("adminToken");

        try {
            if (selectedProducts.length > 0) {
                // Send the array of selected product IDs to the server
                await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, {
                    data: selectedProducts,
                    headers: {
                        Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                    },
                });
                fetchProducts(); // Refresh the product list
                // toast or notification of adding to cart 
                toast({
                    title: "Product deleted!",
                    description: `Product deleted from the database successfully!`,
                    className: 'bg-red-500 text0'
                });
                console.log("Products removed successfully!");
            } else {
                await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, {
                    data: { _id: productIdToDelete },
                    headers: {
                        Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                    },
                });
                fetchProducts();
                console.log("Product removed successfully!");
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
        setShowPopup(false);
        setSelectedProducts([]); // Clear selected products after deletion
    };

    const confirmDeleteAll = async () => {
        const adminToken = localStorage.getItem("adminToken");

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/delete-all`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                },
            });
            console.log(response.data.message); // Log success message from the server
            fetchProducts(); // Refresh the product list after deletion
        } catch (error) {
            console.error("Error removing products:", error.response ? error.response.data.message : error.message);
        }
        setShowPopup(false);
        setSelectedProducts([]); // Clear selected products after deletion
    };

    const downloadAll = async () => {
        const adminToken = localStorage.getItem("adminToken");

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/download`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
                responseType: 'blob', // 👈 This is important to handle file downloads
            });

            // Create a link and trigger a file download
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.csv'); // 👈 file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error?.response?.data || error.message);
        }
    };


    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all products
            const allProductIds = allProducts.map(product => product._id);
            setSelectedProducts(allProductIds);
        } else {
            // Deselect all products
            setSelectedProducts([]);
        }
    };

    const handleCheckboxChange = (productId) => {
        if (selectedProducts.includes(productId)) {
            // If already selected, remove it
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            // If not selected, add it
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleCSVUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setCsvFile(files); // Store the uploaded file in state
        setShowConfirmUpload(true); // Show confirmation popup
    };

    const confirmCSVUpload = async () => {
        const adminToken = localStorage.getItem("adminToken");

        const formData = new FormData();
        csvFile.forEach((file, index) => {
            formData.append("files", file); // Backend should handle this as array of files
        });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            console.log("Products uploaded successfully:", response.data);
            fetchProducts();
        } catch (error) {
            console.error("Error uploading CSVs:", error);
        } finally {
            setShowConfirmUpload(false);
            setCsvFile([]); // Reset
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString(); // HH:MM:SS
            const formattedDate = now.toLocaleDateString(); // DD/MM/YYYY or MM/DD/YYYY based on locale

            setCurrentTime(`${formattedTime}`);
            setCurrentDate(`${formattedDate}`);
        };

        updateTime(); // Set initial value immediately
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (

        <>
            <header className="top-0 header-sdw">
                <Header />
            </header>

            < div className="container mx-auto p-2" >
                <div className='flex flex-row justify-between items-center mt-10'>

                    <div className='flex flex-col'>
                        <span className='text-4xl text3'>Inventory Dashboard</span>
                        <div className='bg-blue-500 rounded-lg self-start'><span className="text2 text-2xl font-bold mb-5 text-gray-300 px-3 py-2">Admin Access</span></div>
                    </div>

                    <div className='flex flex-row items-start gap-5 mr-5'>
                        <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
                            <span className='text-lg text0 self-end text-green-300'>Time</span>
                            <span className='text-2xl text2'>{currentTime}</span>
                        </div>
                        <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
                            <span className='text-lg text0 self-end text-green-300'>Date</span>
                            <span className='text-2xl text2'>{currentDate}</span>
                        </div>
                    </div>
                </div>

                <div className="my-10"></div>

                <ProductForm
                    ref={formRef}
                    editingProduct={editingProduct}
                    onProductAdd={handleProductAdded}
                    onProductUpdate={handleProductUpdated}
                    onClearEditing={() => setEditingProduct(null)}
                />

                {
                    showConfirmUpload && (
                        <ConfirmationPopup
                            message="Are you sure you want to upload this CSV file?"
                            onConfirm={confirmCSVUpload}
                            onCancel={() => setShowConfirmUpload(false)}
                        />
                    )
                }

                <div className="bg-white p-2 rounded-lg shadow-md text-black">
                    <div className="flex flex-row gap-10 justify-between items-center border p-3 mb-4">

                        <h2 className="text-xl font-semibold text-black text2">Total Inventory</h2>

                        <div className="flex flex-row mb-4 space-x-2 text-black">

                            {/* searchbar  */}
                            <div className="relative gap-2 my-4 w-full">
                                <input
                                    type="text"
                                    placeholder="Search by Name, Brand, or HSN"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="border p-2 rounded w-full pr-20"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                                    >
                                        Clear
                                    </button>
                                )}
                                {isSearching && (
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                onClick={downloadAll}
                                className="bg-green-400 text-black p-2 rounded hover:bg-green-700 transition my-4"
                            >
                                Export as CSV
                            </Button>
                            <Button
                                variant="outline"
                                onClick={confirmDeleteAll}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition my-4"
                            >
                                Delete All Products
                            </Button>
                            <Button
                                variant="outline"
                                onClick={confirmDelete}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition my-4"
                                disabled={selectedProducts.length === 0}
                            >
                                Delete Selected Products
                            </Button>
                        </div>

                    </div>

                    {debouncedSearchTerm && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
                            <p className="text-sm text-blue-800">
                                Searching for: <strong>"{debouncedSearchTerm}"</strong>
                                {!isSearching && ` - Found ${filteredProducts.length} product(s)`}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-center gap-4 my-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="self-center text-lg">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    <div className="" style={{ height: '1000px', overflowY: 'auto' }}>
                        <table className="w-full border border-gray-300 rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 border">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                        />
                                    </th>

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
                                    <th className="p-2 border">Lower Discount Price</th>
                                    <th className="p-2 border">Higher Discount Price</th>
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
                                {filteredProducts.map((product, index) => (
                                    <tr key={product._id} className={index % 2 === 0 ? "bg-white" : "bg-white"}>
                                        <td className="p-2 border">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts([...selectedProducts, product._id]);
                                                    } else {
                                                        setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                                    }
                                                }}
                                            />
                                        </td>
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
                                        <td className="p-2 border">
                                            <img src={product.imageURL} alt="prod_image" className="w-full"></img>
                                        </td>
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
                                        <td className="p-2 border">₹{product.discounted_price_lower}</td>
                                        <td className="p-2 border">₹{product.discounted_price_higher}</td>
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
                    </div>

                </div>

                {
                    showPopup && (
                        <ConfirmationPopup
                            message={actionType === "delete" ? "Are you sure you want to delete this product?" : "Are you sure you want to update this product?"}
                            onConfirm={actionType === "delete" ? confirmDelete : updateProductData}
                            onCancel={() => setShowPopup(false)}
                        />
                    )
                }

                <div className="p-2 bg-white rounded-lg my-10"><CatInv updateProduct={updateProduct} deleteProduct={deleteProduct} /></div>
            </div >



        </>
    );
}