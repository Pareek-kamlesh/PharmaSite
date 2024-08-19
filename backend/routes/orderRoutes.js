const express = require('express');
const { placeOrder } = require('../controllers/orderController');
const path = require('path');

const router = express.Router();

// Route to place an order
router.post('/placeOrder', placeOrder);

// Route to download the CSV report
router.get('/downloadCSV', (req, res) => {
    const file = path.join(__dirname, '../public/orders.csv');
    res.download(file);
});

module.exports = router;
