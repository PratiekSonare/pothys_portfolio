import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Allow your domain and localhost for development
        const allowedOrigins = [
            'https://ecom.engineermonke.space',
            'http://localhost:3000',
            'http://localhost:4000'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'trial',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    discount: Number,
    discounted_price: Number,
    rating: Number,
    quantity_ordered: Number,
    barcode: String,
    avail: Boolean,
    codenum: String,
    category: String,
    imageURL: String,
    dow: String
});

const Product = mongoose.model('Product', productSchema, 'productlist');

// API Routes

// Add Products (Single or Multiple)
app.post('/api/products', async (req, res) => {
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

// Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Products by Category (Supports Multiple Categories)
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const categories = req.params.category.split(',');
        const products = await Product.find({ category: { $in: categories } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Products (Single or Multiple)
app.put('/api/products', async (req, res) => {
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

// Delete Products (Single or Multiple)
app.delete('/api/products', async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            await Product.deleteMany({ _id: { $in: req.body.map(p => p._id) } });
            res.json({ message: 'Products deleted' });
        } else {
            await Product.findByIdAndDelete(req.body._id);
            res.json({ message: 'Product deleted' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
