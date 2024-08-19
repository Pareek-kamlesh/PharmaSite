const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/productModel'); // Adjust path as necessary
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Read data from JSON file
const importProducts = async () => {
    try {
        const filePath = path.join(__dirname, 'products.json'); // Adjust path as necessary
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const products = JSON.parse(fileData);

        // Delete existing products (optional)
        await Product.deleteMany({});

        // Insert new products
        await Product.insertMany(products);
        console.log('Products imported successfully.');
    } catch (error) {
        console.error('Error importing products:', error);
    } finally {
        mongoose.disconnect();
    }
};

importProducts();
