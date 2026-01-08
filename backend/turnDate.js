import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'trial', // change if your DB name is different
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Product Schema
const productSchema = new mongoose.Schema({
    brand: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    hsn: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    avail: { type: Boolean, required: true, default: true },
    dow: { type: Boolean, required: true, default: false },
    imageURL: { type: String, default: "NA" },
    batchnum: { type: String, required: true },
    expiry: { type: String, required: true },
    dealer_price: { type: Number, required: true },
    num_units_ordered: { type: Number, required: true, default: 0 },
  
    // Optional fields
    product_feature: { type: String },
    product_tags: [String],
    discount_lower: { type: Number, default: 0 },
    discount_higher: { type: Number, default: 0 },
    discount: { type: Number, default: 0},
    discounted_price_lower: { type: Number },
    discounted_price_higher: { type: Number }
});

const Product = mongoose.model('Product', productSchema, 'productlist');


// Helper function to format Date to YYYY-MM-DD
function formatDate(date) {
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch (err) {
    console.error('❌ Invalid date:', date);
    return null;
  }
}

// Main logic
async function updateExpiryDates() {
  try {
    const products = await Product.find();

    let updatedCount = 0;

    for (const product of products) {
      const original = product.expiry;

      const formatted = formatDate(original);

      if (formatted && original !== formatted) {
        product.expiry = formatted;
        await product.save();
        console.log(`✅ Updated expiry for _id: ${product._id} → ${formatted}`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Done! Total updated: ${updatedCount}`);
  } catch (error) {
    console.error('❌ Error during update:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔒 MongoDB connection closed.');
  }
}

updateExpiryDates();
