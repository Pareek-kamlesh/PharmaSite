const express = require('express');
const { getProducts, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, createProduct);

module.exports = router;
