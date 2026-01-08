// syncToNotion.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Client as NotionClient } from '@notionhq/client';

dotenv.config();

// Initialize Notion client
const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

// Define a Mongoose schema (optional: useful if you want validation or reuse)
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
    expiry: { type: Date, required: true },
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function main() {
  try {
    // Connect to MongoDB with Mongoose
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'trial',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected using Mongoose');

    // Fetch documents
    let documents = [];
    try {
      documents = await Product.find({}).limit(200).lean(); // `lean()` gives plain JS objects
      console.log(`📦 Retrieved ${documents.length} documents`);
    } catch (fetchErr) {
      console.error("❌ Error fetching data:", fetchErr.message);
      return;
    }

    // Push each document to Notion
    for (const doc of documents) {
        try {
          // Step 1: Search for an existing page by HSN (or any unique identifier)
          const searchResults = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
              property: "HSN",
              rich_text: {
                equals: doc.hsn || "N/A",
              },
            },
          });
      
          const existingPage = searchResults.results[0];
      
          const properties = {
            Name: {
              title: [
                {
                  text: {
                    content: doc.name || "Unnamed Product",
                  },
                },
              ],
            },
            Brand: {
              rich_text: [
                {
                  text: {
                    content: doc.brand || "No brand",
                  },
                },
              ],
            },
            HSN: {
              rich_text: [
                {
                  text: {
                    content: doc.hsn || "N/A",
                  },
                },
              ],
            },
            Price: {
              number: doc.price || 0,
            },
            Quantity: {
              number: doc.quantity || 0,
            },
            Num_Units_Ordered: {
              number: doc.num_units_ordered || 0,
            },
            Unit: {
              rich_text: [
                {
                  text: {
                    content: doc.unit || "",
                  },
                },
              ],
            },
            Category: {
              select: {
                name: doc.category || "Other",
              },
            },
            Available: {
              checkbox: doc.avail === true,
            },
            Dealer_Price: {
              number: doc.dealer_price || 0,
            },
            Discount_Lower: {
              number: doc.discount_lower || 0,
            },
            Discount_Higher: {
              number: doc.discount_higher || 0,
            },
            Discount_Price_Lower: {
              number: doc.discounted_price_lower || 0,
            },
            Discount_Price_Higher: {
              number: doc.discount_price_higher || 0,
            },
            Expiry: {
              date: {
                start: new Date(doc.expiry).toISOString(),
              },
            },
          };
      
          if (existingPage) {
            // Step 2: Update existing entry
            await notion.pages.update({
              page_id: existingPage.id,
              properties,
            });
            console.log(`📝 Updated: ${doc.name}`);
          } else {
            // Step 3: Create new entry
            await notion.pages.create({
              parent: { database_id: process.env.NOTION_DATABASE_ID },
              properties,
            });
            console.log(`✅ Created new: ${doc.name}`);
          }
        } catch (err) {
          console.error(`❌ Failed to sync ${doc._id}:`, err.message);
        }
      }

      await delay(2000);
      

    await mongoose.disconnect();
    console.log("🔒 MongoDB connection closed.");
  } catch (err) {
    console.error("❌ Main process error:", err.message);
  }
}

main();
