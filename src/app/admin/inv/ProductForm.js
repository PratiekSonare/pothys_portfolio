"use client";
import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import QRCodeScanner from "../fastcart/QRCode";
import { useToast } from "@/hooks/use-toast";
import categoryMap from '../../data/categoryMap';
import { LuBarcode as BarcodeIcon, LuQrCode as QrCode, LuLoader2 as Loader2 } from "react-icons/lu";

const ProductForm = forwardRef(({ editingProduct, onProductUpdate, onProductAdd, onClearEditing }, ref) => {
    const { toast } = useToast();
    const [qrPanel, setQrPanel] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(editingProduct?.category || "");

    const [existingHSNs, setExistingHSNs] = useState([]);
    const [hsnExists, setHsnExists] = useState(false);
    const [checkingHsn, setCheckingHsn] = useState(false);
    const [csvFiles, setCsvFiles] = useState([]);
    const [uploadingCsv, setUploadingCsv] = useState(false);

    const form = useForm({
        defaultValues: {
            brand: "", name: "", hsn: "", price: 0, dealer_price: 0,
            discount_lower: 0, discount_higher: 0, discounted_price_lower: 0,
            discounted_price_higher: 0, quantity: 0, unit: "", product_feature: "",
            product_tags: "", imageURL: "", category: "", subcategory: "",
            dow: "false", avail: true, batchnum: "", expiry: "",
            num_units_ordered: 0, csv: null,
        },
    });

    const { setValue, watch, reset } = form;
    const price = watch("price") || 0;
    const discount_lower = watch("discount_lower") || 0;
    const discount_higher = watch("discount_higher") || 0;

    // Fetch all HSNs on mount for client-side validation
    useEffect(() => {
        const fetchHSNs = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/all-hsn`);
                setExistingHSNs(res.data);
            } catch (err) {
                console.error("Error fetching HSNs:", err);
            }
        };
        fetchHSNs();
    }, []);

    // Effect to populate form when `editingProduct` changes
    useEffect(() => {
        if (editingProduct) {
            reset({
                brand: editingProduct.brand || "",
                name: editingProduct.name || "",
                hsn: editingProduct.hsn || "",
                price: editingProduct.price || 0,
                discount_lower: editingProduct.discount_lower || 0,
                discount_higher: editingProduct.discount_higher || 0,
                quantity: editingProduct.quantity || 0,
                unit: editingProduct.unit || "",
                product_feature: editingProduct.product_feature || "",
                product_tags: editingProduct.product_tags || "",
                imageURL: editingProduct.imageURL || "",
                category: editingProduct.category || "",
                subcategory: editingProduct.subcategory || "",
                dow: editingProduct.dow?.toString() || "false",
                avail: editingProduct.avail?.toString() || "true",
                batchnum: editingProduct.batchnum || "",
                expiry: editingProduct.expiry || "",
                dealer_price: editingProduct.dealer_price || 0,
                num_units_ordered: editingProduct.num_units_ordered || 0,
                csv: null,
            });
            setSelectedCategory(editingProduct.category || "");
        } else {
            reset(); // Reset form if we are not editing
            setSelectedCategory("");
        }
    }, [editingProduct, reset]);

    // Effects for calculating discounted prices
    useEffect(() => {
        const discountedPrice = price - (price * discount_lower) / 100;
        setValue("discounted_price_lower", discountedPrice.toFixed(2));
    }, [price, discount_lower, setValue]);

    useEffect(() => {
        const discountedPriceHigher = price - (price * discount_higher) / 100;
        setValue("discounted_price_higher", discountedPriceHigher.toFixed(2));
    }, [price, discount_higher, setValue]);

    // Debounced HSN check
    useEffect(() => {
        const checkHsn = setTimeout(() => {
            const currentHsn = watch('hsn');
            if (currentHsn && (!editingProduct || editingProduct.hsn !== currentHsn)) {
                setCheckingHsn(true);
                const exists = existingHSNs.includes(currentHsn.trim());
                setHsnExists(exists);
                setCheckingHsn(false);
            } else {
                setHsnExists(false);
            }
        }, 500);

        return () => clearTimeout(checkHsn);
    }, [watch('hsn'), existingHSNs, editingProduct]);


    const onSubmit = async (data) => {
        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
            toast({ title: "Authentication Error", description: "Admin token not found.", variant: "destructive" });
            return;
        }

        if (editingProduct) {
            // UPDATE
            if (hsnExists) {
                alert("HSN already exists. Please use a unique HSN.");
                return;
            }
            const updatedData = { ...editingProduct, ...data };
            try {
                await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, updatedData, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                toast({ title: "Product Updated", description: "The product has been updated successfully.", className: 'bg-green-500 text0' });
                onProductUpdate(); // Notify parent
            } catch (error) {
                console.error("Error updating product:", error.response?.data || error.message);
                toast({ title: "Update Failed", description: "Failed to update product.", variant: "destructive" });
            }
        } else {
            // ADD
            if (hsnExists) {
                alert("HSN already exists. Please use a unique HSN.");
                return;
            }
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, data, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                toast({ title: "Product Added", description: "New product added to the database.", className: 'bg-green-500 text0' });
                onProductAdd(); // Notify parent
            } catch (error) {
                console.error("Error adding product:", error.response?.data || error.message);
                toast({ title: "Add Failed", description: "Failed to add product.", variant: "destructive" });
            }
        }
    };

    const handleScan = (scannedValue) => {
        setValue("hsn", scannedValue, { shouldValidate: true });
    };

    const handleCSVUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        setCsvFiles(files);
    };

    const confirmCSVUpload = async () => {
        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
            toast({ title: "Authentication Error", description: "Admin token not found.", variant: "destructive" });
            return;
        }

        if (csvFiles.length === 0) {
            toast({ title: "No Files Selected", description: "Please select CSV files to upload.", variant: "destructive" });
            return;
        }

        setUploadingCsv(true);
        const formData = new FormData();
        csvFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );
            toast({ 
                title: "CSV Upload Successful", 
                description: `${csvFiles.length} file(s) uploaded successfully!`, 
                className: 'bg-green-500 text-white' 
            });
            setCsvFiles([]);
            onProductAdd(); // Refresh product list
        } catch (error) {
            console.error("Error uploading CSVs:", error);
            toast({ 
                title: "Upload Failed", 
                description: error.response?.data?.message || "Failed to upload CSV files.", 
                variant: "destructive" 
            });
        } finally {
            setUploadingCsv(false);
        }
    };

    const requiredClass = 'text-red-500 bg-red-200 p-1 rounded-lg font-bold';

    return (
        <div className={`grid ${qrPanel ? "grid-cols-[4fr_1fr]" : "grid-cols-1"} space-x-5`}>
            <Form {...form}>
                <form
                    ref={ref}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mb-6 bg-white p-6 rounded-lg shadow-md space-y-4 text-black"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text3 text-center text-3xl font-semibold text-gray-700">
                            {editingProduct ? "Edit Product" : "Add a Product"}
                        </h2>
                        {editingProduct && (
                            <Button variant="ghost" onClick={onClearEditing}>Cancel Edit</Button>
                        )}
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        {/* PRODUCT DETAILS */}
                        <div className="col-span-2 space-y-4 border border-black rounded-lg p-5">
                            <span className="col-span-2 text2 text-2xl text-gray-600">Product Details</span>
                            <div className="grid grid-cols-[7fr_6fr] gap-10 col-span-2">
                                <div className="grid grid-cols-[4fr_1fr] gap-1 items-start justify-center">
                                    <FormField
                                        control={form.control}
                                        name="hsn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-row gap-2 items-center">
                                                    <FormLabel className={requiredClass}>HSN</FormLabel>
                                                    <span className="text1 text-xs text-gray-500 self-end">
                                                        (Click and scan product barcode <BarcodeIcon className="inline-block" /> to enter HSN number)
                                                    </span>
                                                </div>
                                                <FormControl>
                                                    <div className="flex flex-row items-center gap-2">
                                                        <Input type="text" placeholder="HSN" className="bg-white" required {...field} />
                                                        <button type="button" onClick={() => setQrPanel(!qrPanel)} className={`w-1/3 px-1 h-[42px] flex items-center justify-center ${!qrPanel ? "bg-red-500" : "bg-gray-200"} rounded-lg transition`}>
                                                            <QrCode className={`w-5 h-5 ${!qrPanel ? "text-white" : "text-red-500"}`} />
                                                            <span className={`text0 ml-2 ${!qrPanel ? "text-white" : "text-red-500"}`}>{!qrPanel ? "Scan HSN" : "Close"}</span>
                                                        </button>
                                                        {checkingHsn && <Loader2 className="animate-spin text-blue-500 w-4 h-4" />}
                                                    </div>
                                                </FormControl>
                                                {hsnExists && <p className="text-sm text-red-500 mt-1">⚠️ This HSN number already exists.</p>}
                                                {!hsnExists && watch('hsn') && !checkingHsn && <p className="text-sm text-green-600 mt-1">✅ HSN is unique.</p>}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-row gap-10">
                                    <FormField control={form.control} name="brand" render={({ field }) => (<FormItem><FormLabel>Product Brand</FormLabel><FormControl><Input placeholder="Product Brand" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Product Name</FormLabel><FormControl><Input placeholder="Product Name" required {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 col-span-2 gap-10">
                                <FormField control={form.control} name="product_feature" render={({ field }) => (<FormItem><FormLabel>Product Feature</FormLabel><FormControl><Input type="text" placeholder="Product Feature" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="product_tags" render={({ field }) => (<FormItem><FormLabel>Product Tags</FormLabel><FormControl><Input type="text" placeholder="Product Tags" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </div>

                        {/* QUANTITY DETAILS */}
                        <div className="col-span-1 space-y-4 p-5 border border-black rounded-lg">
                            <span className="col-span-2 text2 text-2xl text-gray-600">Quantity Details</span>
                            <div className="flex flex-row gap-10">
                                <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Quantity</FormLabel><FormControl><Input type="number" placeholder="Quantity" required {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="num_units_ordered" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Units Ordered</FormLabel><FormControl><Input type="number" placeholder="Units Ordered" required {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <FormField control={form.control} name="unit" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Unit</FormLabel><FormControl><select {...field} required className="border p-2 rounded w-full"><option value="" disabled>Select a unit</option><option value="kg">kg</option><option value="g">g</option><option value="ml">ml</option><option value="litre">L</option><option value="pcs">pcs</option></select></FormControl><FormMessage /></FormItem>)} />
                            <div className="flex flex-row justify-center items-center gap-10">
                                <FormField control={form.control} name="batchnum" render={({ field }) => (<FormItem><FormLabel>Batch Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="expiry" render={({ field }) => (<FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </div>

                        {/* PRICE DETAILS */}
                        <div className="flex flex-col p-5 border border-black rounded-lg space-y-4">
                            <span className="text2 text-2xl text-gray-600">Price Details</span>
                            <div className="flex flex-row gap-10">
                                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>MRP</FormLabel><FormControl><Input type="number" placeholder="Price" required {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="dealer_price" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Dealer Price</FormLabel><FormControl><Input type="number" placeholder="Dealer Price" required {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <div className="flex flex-row gap-10">
                                <FormField control={form.control} name="discount_lower" render={({ field }) => (<FormItem><FormLabel>Min. Discount (%)</FormLabel><FormControl><Input type="number" placeholder="Optional Lower Discount" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="discount_higher" render={({ field }) => (<FormItem><FormLabel>Max. Discount (%)</FormLabel><FormControl><Input type="number" placeholder="Optional Higher Discount" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <div className="flex flex-row gap-10">
                                <FormField control={form.control} name="discounted_price_lower" render={({ field }) => (<FormItem><FormLabel className='font-bold'>Min. Price</FormLabel><FormControl><Input type="number" value={form.getValues("discounted_price_lower")} disabled {...field} className='bg-gray-300' /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="discounted_price_higher" render={({ field }) => (<FormItem><FormLabel className='font-bold'>Max. Price</FormLabel><FormControl><Input type="number" value={form.getValues("discounted_price_higher")} disabled {...field} className='bg-gray-300' /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </div>

                        {/* OTHER DETAILS */}
                        <div className="flex flex-row items-center space-x-5 w-full">
                            <FormField control={form.control} name="imageURL" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Image URL</FormLabel><FormControl><Input type="text" placeholder="Image URL" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="dow" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Deal of the Week</FormLabel><FormControl><select {...field} required className="border p-2 rounded w-full"><option value="true">True</option><option value="false">False</option></select></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="avail" render={({ field }) => (<FormItem><FormLabel className={requiredClass}>Availability</FormLabel><FormControl><select {...field} required className="border p-2 rounded w-full"><option value="true">Available</option><option value="false">Out of Stock</option></select></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        {/* CATEGORY DETAILS */}
                        <div className="flex flex-row items-center space-x-5 w-full">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={requiredClass}>Select Category</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                required
                                                className="border p-2 rounded w-full"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setSelectedCategory(e.target.value);
                                                }}
                                            >
                                                <option value="" disabled>Select a category</option>
                                                {Object.keys(categoryMap).map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subcategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={requiredClass}>Select Sub-Category</FormLabel>
                                        <FormControl>
                                            <select {...field} required className="border p-2 rounded w-full">
                                                <option value="" disabled>
                                                    {selectedCategory ? "Select a sub-category" : "Select a category first"}
                                                </option>
                                                {selectedCategory && categoryMap[selectedCategory]?.map((sub, idx) => (
                                                    <option key={idx} value={sub}>{sub}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className={`bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition ${hsnExists && 'cursor-not-allowed bg-gray-400'}`} disabled={hsnExists}>
                        {editingProduct ? "Update Product" : "Add Product"}
                    </Button>

                    {/* CSV BULK UPLOAD SECTION */}
                    <div className="border-t-2 pt-4 mt-4">
                        <h3 className="text2 text-xl text-gray-600 mb-3">Bulk Upload via CSV</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <Input
                                    type="file"
                                    accept=".csv"
                                    multiple
                                    onChange={handleCSVUpload}
                                    className="flex-1"
                                />
                                <span className="text-sm text-gray-500">
                                    {csvFiles.length > 0 ? `${csvFiles.length} file(s) selected` : "No files selected"}
                                </span>
                            </div>
                            <Button
                                type="button"
                                onClick={confirmCSVUpload}
                                disabled={csvFiles.length === 0 || uploadingCsv}
                                className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {uploadingCsv ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Uploading...
                                    </span>
                                ) : (
                                    "Upload CSV Files"
                                )}
                            </Button>
                        </div>
                    </div>

                </form>
            </Form>

            {qrPanel && (
                <div className="p-5 text0 rounded-lg card-sdw flex flex-col justify-center items-center bg-white">
                    <span className="text3 text-xl md:text-2xl mb-5">Scan QR/Barcode</span>
                    <QRCodeScanner onScan={handleScan} />
                </div>
            )}
        </div>
    );
});

ProductForm.displayName = 'ProductForm';

export default ProductForm;