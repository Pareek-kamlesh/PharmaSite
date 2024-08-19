// Import required modules
const Cart = require('../models/cartModel'); // Import the Cart model
const Product = require('../models/productModel'); // Import the Product model
const asyncHandler = require('express-async-handler');

// POST endpoint to add a product to the cart
// POST endpoint to add a product to the cart
const addToCart = asyncHandler(async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            const existingItem = cart.items.find(item => item.product.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
            } else {
                cart.items.push({
                    product: productId,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    totalPrice: product.price * quantity,
                });
            }

            await cart.save();
        } else {
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    totalPrice: product.price * quantity,
                }],
            });

            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = { addToCart };
