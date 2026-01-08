import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import csv from 'csv-parser'; // Ensure you have this package installed
import fs from 'fs';
import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';


dotenv.config();
const app = express();

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin ||
            origin.startsWith('https://pothys.onrender.com') ||
            origin.startsWith('https://skshoppers.com') ||
            origin.startsWith('http://localhost:3000') ||
            origin.startsWith('http://localhost:3001')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'production_1',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// function to slugify parameters
const slugify = (text) =>
    text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// Product Schema
const productSchema = new mongoose.Schema({
    brand: { type: String, required: false, default: "", trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    hsn: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, trim: true, default: "NA" },
    category: { type: String, default: "NA", required: true },
    category_slug: { type: String, default: "NA" },
    subcategory: { type: String, default: "NA", required: true },
    subcategory_slug: { type: String, default: "NA" },
    avail: { type: Boolean, required: true, default: true },
    dow: { type: Boolean, required: true, default: false },

    // Optional fields
    batchnum: { type: String },
    expiry: { type: String },
    dealer_price: { type: Number, default: "" },
    num_units_ordered: { type: Number, default: 0 },
    stock_inv: { type: Number, default: 0 },
    imageURL: { type: String, default: "NA" },
    product_feature: { type: String },
    product_tags: [String],
    discount_lower: { type: Number, default: 0 },
    discount_higher: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discounted_price_lower: { type: Number },
    discounted_price_higher: { type: Number }
});

productSchema.pre('save', function (next) {
    if (this.category) {
        this.category_slug = slugify(this.category);
    }
    if (this.subcategory) {
        this.subcategory_slug = slugify(this.subcategory);
    }
    if (this.isNew && this.stock_inv == 0) {
        this.stock_inv = this.num_units_ordered;
    }
    next();
});


// Admin schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Employee schema
const employeeSchema = new mongoose.Schema({
    full_name: String,
    phone: Number,
    aadhar: Number,
    address: String,
    branch: String,
    username: String,
    password: String,
    empID: String,
    succ_tran: Number,
    verification: String,
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },
    date_time: { type: Date, default: Date.now },
    status: { type: String, enum: ["success", "failure"], required: true },
    payment_method: { type: String, enum: ["UPI", "Cash"], required: true },
    total_amount: { type: Number, required: true },
    delivery_status: { type: String, enum: ["pending", "complete"], required: true },
    cartItems: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            // brand: { type: String, required: false },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            // discount: { type: Number, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true },
        },
    ],
    customer: {  // Change from array to object
        customer_name: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
    },
});

const Product = mongoose.model('Product', productSchema, 'productlist');
const Admin = mongoose.model("Admin", adminSchema, 'admin');
const Employee = mongoose.model("Employee", employeeSchema, 'employee');
const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

// AUTH / MIDDLEWARE (IMPORTANT) 

// Fake Admin Credentials (Replace with DB-stored credentials)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync("admin", 10);
const API_KEY = process.env.NEXT_PUBLIC_TRANSACTION_API_KEY;

const verifyApiKey = (req, res, next) => {
    const key = req.headers['x-api-key'];
    if (key && key === API_KEY) {
        next();
    } else {
        res.status(403).json({ success: false, message: "Forbidden: Invalid or missing API key." });
    }
};

const verifyAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from Bearer
    // console.log(`Recieved token in backend is`, token); 
    if (!token) {
        return res.status(403).json({ message: "Access Denied. Contact administrator or login as admin before making changes!" });
    }

    try {
        const decoded = jwt.verify(token, 'iLOVEpaneer65');
        // console.log("Decoded Token:", decoded);
        if (decoded.role !== "admin") {
            console.log("Unauthorized Access - Not an Admin:", decoded.role);
            return res.status(403).json({ message: "Unauthorized" });
        }
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};

// API Routes
app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Received username:", username);
        console.log("Received password:", password);

        // Find the admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log("Admin not found");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare plain text password directly
        if (admin.password !== password) {
            console.log("Password does not match");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate a token
        const token = jwt.sign({ id: admin._id, role: "admin" }, 'iLOVEpaneer65', { expiresIn: "12h" });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Add Products (Single or Multiple)
app.post('/api/products', verifyAdmin, async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const products = await Product.insertMany(req.body);
            res.status(201).json(products);
        } else {
            const product = new Product(req.body);
            await product.save();
            res.status(201).json(product);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/products/search
app.get('/api/products/search', async (req, res) => {
    const { category, subcategory, q, page = 1, limit = 500 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {};

    if (category) filters.category_slug = category.toLowerCase();
    if (subcategory) filters.subcategory_slug = subcategory.toLowerCase();
    if (q) filters.name = { $regex: q, $options: 'i' };

    try {
        const products = await Product.find(filters)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filters);

        res.json({
            products,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// routes/products.js (or relevant controller)
app.get('/api/categories/discounts', async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $match: {
                    discount_lower: { $gt: 0 }  // Only non-zero discounts
                }
            },
            {
                $group: {
                    _id: "$subcategory_slug",
                    minNonZeroDiscount: { $min: "$discount_lower" }
                }
            }
        ]);

        const formatted = {};
        result.forEach(item => {
            formatted[item._id] = item.minNonZeroDiscount;
        });

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching discounts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Get All Products with optional search and pagination
app.get('/api/products', verifyApiKey, async (req, res) => {
    const searchTerm = req.query.search || '';
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 20 products per page
    const skip = (page - 1) * limit; // Calculate how many products to skip

    try {
        // Build search filter
        const searchFilter = searchTerm ? {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { brand: { $regex: searchTerm, $options: 'i' } },
                { hsn: { $regex: searchTerm, $options: 'i' } }
            ]
        } : {};

        const products = await Product.find(searchFilter)
            .skip(skip) // Skip the products for pagination
            .limit(limit); // Limit the number of products returned

        const totalProducts = await Product.countDocuments(searchFilter);

        res.json({
            products,
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Products by Category Slug with Pagination
app.get('/api/products/category/:slug', verifyApiKey, async (req, res) => {
    const slug = req.params.slug.toLowerCase();
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const searchTerm = req.query.search || '';

    try {
        // Build filter with category and optional search
        const filter = { category_slug: slug };
        
        if (searchTerm) {
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { brand: { $regex: searchTerm, $options: 'i' } },
                { hsn: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        let query = Product.find(filter);

        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }

        const products = await query.exec();
        const totalProducts = await Product.countDocuments(filter);

        const response = {
            products,
            totalProducts
        };

        if (page && limit) {
            response.currentPage = page;
            response.totalPages = Math.ceil(totalProducts / limit);
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.get('/api/products/hsn/:hsn', verifyApiKey, async (req, res) => {
    try {
        const hsn = req.params.hsn;

        const products = await Product.find({ hsn: hsn });

        // Check if any products were found
        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ message: 'No products found with this HSN number.' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Get all unique HSN numbers
app.get('/api/products/all-hsn', async (req, res) => {
    try {
        // Fetch only the HSN field from all products
        const products = await Product.find({}, { hsn: 1, _id: 0 });

        // Extract unique non-null HSNs
        const hsnList = [...new Set(
            products
                .map(p => p.hsn?.toString()?.trim())
                .filter(hsn => hsn && hsn !== '')
        )];

        res.json(hsnList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Products with dow = true
app.get('/api/products/dow-true', verifyApiKey, async (req, res) => {
    try {
        const products = await Product.find({ dow: true });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Products (Single or Multiple)
app.put('/api/products', verifyAdmin, async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const updatedProducts = await Promise.all(
                req.body.map(product =>
                    Product.findByIdAndUpdate(product._id, product, { new: true })
                )
            );
            res.json(updatedProducts);
        } else {
            const updatedProduct = await Product.findByIdAndUpdate(req.body._id, req.body, { new: true });
            res.json(updatedProduct);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.patch('/decsto/:id', async (req, res) => {
    const { id } = req.params;
    const { numOrder } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const orderQty = Number(numOrder);
        if (isNaN(orderQty)) {
            return res.status(400).json({ success: false, message: "Invalid numOrder" });
        }

        if (product.stock_inv < 0) {
            return res.status(400).json({ success: false, message: "Insufficient stock" });
        }

        product.stock_inv -= orderQty;
        await product.save();

        return res.status(200).json({ success: true, message: "Stock updated", updatedStock: product.stock_inv });
    } catch (error) {
        console.error("Error decrementing stock:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// Delete Products (Single or Multiple or Clear All)
app.delete('/api/products', verifyAdmin, async (req, res) => {
    try {
        // Check if the request body contains a flag to clear all products
        if (req.body.clearAll) {
            // Clear all products
            await Product.deleteMany({});
            return res.json({ message: 'All products cleared' });
        }

        // Check if the request body contains an array of IDs
        if (Array.isArray(req.body)) {
            // Use deleteMany to remove products with the specified IDs
            await Product.deleteMany({ _id: { $in: req.body } });
            return res.json({ message: 'Products deleted' });
        } else {
            // If a single ID is provided, delete that product
            await Product.findByIdAndDelete(req.body._id);
            return res.json({ message: 'Product deleted' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE route to remove all products
app.delete('/api/products/delete-all', verifyAdmin, async (req, res) => {
    try {
        const result = await Product.deleteMany({}); // Deletes all products
        res.status(200).json({ message: 'All products deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Error deleting products:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CSV DATA UPLOAD API
app.post('/api/products/upload', verifyAdmin, upload.array('files'), async (req, res) => {
    const allResults = [];

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        for (const file of req.files) {
            const results = [];

            // Use a promise to read and parse each file
            await new Promise((resolve, reject) => {
                fs.createReadStream(file.path)
                    .pipe(csv())
                    .on('data', (data) => {
                        data.avail = data.avail === "true" || data.avail === "TRUE" || data.avail === "Yes";
                        data.dow = data.dow === "true" || data.dow === "TRUE" || data.dow === "Yes";
                        results.push(data);
                    })
                    .on('end', () => {
                        allResults.push(...results); // Add results from this file to the full array
                        fs.unlinkSync(file.path); // Delete file
                        resolve();
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });
        }

        // Bulk insert after all files are processed
        await Product.insertMany(allResults);
        res.status(200).json({ message: 'Products added successfully from all files', data: allResults });

    } catch (error) {
        console.error("Error during multiple file upload:", error);
        res.status(500).json({ message: 'Error processing uploaded files', error });
    }
});


import { Parser } from 'json2csv'

app.get('/api/products/download', verifyAdmin, async (req, res) => {
    try {
        const products = await Product.find().lean(); // Get all products

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        const fields = Object.keys(products[0]); // Extract keys as headers
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(products);

        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error("Error exporting CSV:", error);
        res.status(500).json({ message: 'Error exporting CSV', error: error.message }); // Send only the error message
    }
});

// -------------------- TRANSACTION SECTION ---------------------------

// TRANSACTION POSTING APIS
app.post("/api/transactions", async (req, res) => {
    try {
        const { cartItems, total_amount, payment_method, customer, delivery_status } = req.body;

        // Generate a unique transaction ID
        const transaction_id = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

        // Create a new transaction entry
        const newTransaction = new Transaction({
            transaction_id,
            cartItems,  // ✅ Storing cart items inside transaction
            total_amount,
            payment_method: "UPI", // Since you're not integrating a payment gateway yet
            customer,
            status: "success",
            delivery_status: "pending" //online delivery
        });

        await newTransaction.save();

        res.status(201).json({ success: true, transaction_id, message: "Transaction recorded successfully." });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// const transactionsCors = {
//     origin: ['https://pothys.onrender.com', 'http://localhost:3000'], // Restrict access only to this domain
//     methods: ['GET'], // Allow only GET requests for transactions
//     credentials: true
// };

// TRANSACTION DATA FETCHING APIS
app.get("/api/transactions", verifyApiKey, async (req, res) => {

    try {
        const { transaction_id, payment_method, delivery_status } = req.query;

        const query = {}

        if (transaction_id) {
            query.transaction_id = transaction_id;
        }

        if (payment_method) {
            query.payment_method = payment_method;
        }

        if (delivery_status) {
            query.delivery_status = delivery_status;
        }

        const transactions = await Transaction.find(query);

        if (transactions.length > 0) {
            return res.status(200).json({ success: true, transactions });
        } else {
            return res.status(404).json({ success: false, message: "No transactions found matching the criteria." })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching transaction data. Please contact administrator.", error: error.message })
    }
});

// TRANSACTION FETCHING BY TRANSACTION ID
app.patch("/api/transactions/:transaction_id", verifyAdmin, async (req, res) => {
    try {
        const { transaction_id } = req.params;
        const { delivery_status } = req.body; // Expecting delivery_status in the request body

        // Validate the delivery_status
        if (!delivery_status || !['pending', 'complete'].includes(delivery_status)) {
            return res.status(400).json({ success: false, message: "Invalid delivery status" });
        }

        // Find the transaction and update its delivery status
        const transaction = await Transaction.findOneAndUpdate(
            { transaction_id },
            { delivery_status },
            { new: true } // Return the updated document
        );

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        return res.status(200).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating transaction status", error: error.message });
    }
});


//  EMP REGISTRATION
app.post("/api/emp/reg", async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// EMP LOGIN
app.post("/api/emp/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Received username:", username);
        console.log("Received password:", password);

        // Find the admin by username
        const employee = await Employee.findOne({ username });

        if (!employee) {
            console.log("Admin not found");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare plain text password directly
        if (employee.password !== password) {
            console.log("Password does not match");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (employee.verification !== 'verified') {
            console.log("Verification pending! Please verify registration from administrator.");
            // alert("Verification pending! Please verify registration from administrator.");
            return res.status(402).json({ success: false, message: "Verification pending! Please verify registration from administrator." });
        }

        // Generate a token
        const token = jwt.sign({ id: employee._id, role: "emp" }, 'iLOVEpaneer65', { expiresIn: "1h" });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// EMP DATA FETCHING APIS
app.get("/api/employee", verifyAdmin, async (req, res) => {
    try {
        const { verification } = req.query;

        const query = {}

        if (verification) {
            query.verification = verification;
        }

        const employee = await Employee.find(query);

        if (employee.length > 0) {
            return res.status(200).json({ success: true, employee });
        } else {
            return res.status(404).json({ success: false, message: "No employee found matching the criteria." })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching employee data. Please contact administrator.", error: error.message })
    }
});

// Update verification status of an employee
app.patch("/api/employee/:username", verifyAdmin, async (req, res) => {
    try {
        const { username } = req.params;
        const { verification, empID } = req.body; // Expecting verification status in the request body

        // Validate the verification status
        if (!verification || !['pending', 'verified'].includes(verification)) {
            return res.status(400).json({ success: false, message: "Invalid verification status" });
        }

        // Find the employee and update its verification status
        const employee = await Employee.findOneAndUpdate(
            { username: username },
            { verification, empID },
            { new: true } // Return the updated document
        );

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        return res.status(200).json({ success: true, employee });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating verification status", error: error.message });
    }
});

// Delete an employee
app.delete("/api/employee/:username", verifyAdmin, async (req, res) => {
    try {
        const { username } = req.params;

        // Find the employee and delete it
        const employee = await Employee.findOneAndDelete({ username: username });

        if (!employee) {f
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        return res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting employee", error: error.message });
    }
});

// Start the server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

