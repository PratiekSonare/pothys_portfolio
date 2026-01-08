import mongoose from "mongoose";
const MONGO_URI="mongodb+srv://pratieksonareisc:qTNOIIosj6tri4Cr@testcluster.vy626.mongodb.net/"

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    dbName: 'trial',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Transaction = mongoose.model("Transaction", new mongoose.Schema({}, { strict: false }));

Transaction.updateMany({}, { $set: { delivery_status: "pending" } })
  .then(res => console.log("Updated:", res))
  .catch(err => console.error(err))
  .finally(() => mongoose.connection.close());