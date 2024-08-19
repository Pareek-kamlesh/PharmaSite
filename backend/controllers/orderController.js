const Product = require('../models/productModel');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

// Function to handle orders and update stock
const placeOrder = async (req, res) => {
    const { cartItems, name, email, address, phone, total, discount, gst } = req.body;

    try {
        const orderData = [];

        // Iterate through each item in the cart and reduce the stock
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            // Reduce the stock by the ordered quantity
            product.stock -= item.quantity;
            await product.save();

            // Add product details to the orderData array
            orderData.push({
                productId: product._id,
                productName: product.name,
                quantity: item.quantity,
                total: product.price * item.quantity + product.price * item.quantity * 0.18 - product.price * item.quantity * 0.2,
                name: name,
                email: email,
                address: address,
                phone: phone,
                dateOfOrder: formatDate(new Date()), // Formatted date
            });
        }

        // Generate CSV report
        const fields = ['productId', 'productName', 'quantity', 'total', 'name', 'email', 'address', 'phone', 'dateOfOrder'];
        const csvParser = new Parser({ fields });
        const csvData = csvParser.parse(orderData);

        const csvFilePath = path.join(__dirname, '../public/orders.csv');

        // Write headers only if the file is empty
        if (fs.existsSync(csvFilePath)) {
            const fileContent = fs.readFileSync(csvFilePath, 'utf8');
            if (fileContent.trim().length === 0) {
                fs.writeFileSync(csvFilePath, csvData); // Write headers and data if file is empty
            } else {
                fs.appendFileSync(csvFilePath, csvData); // Append data without headers
            }
        } else {
            fs.writeFileSync(csvFilePath, csvData); // Create file with headers if not exists
        }

        res.status(200).json({
            message: 'Order placed successfully and stock updated.',
            csvFilePath: '/orders.csv',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Format date function
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
};

module.exports = { placeOrder };
