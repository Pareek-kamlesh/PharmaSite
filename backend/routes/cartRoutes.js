const express = require('express');
const { addToCart } = require('../controllers/cartController'); // Import the controller function

const router = express.Router();

// Route to add product to the cart
router.post('/', addToCart);

module.exports = router;
