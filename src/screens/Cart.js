import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const GST_RATE = 0.18; // 18% GST
const DISCOUNT_RATE = 0.20; // 20% Discount

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            toast.error('Please log in to access the Cart.');
            navigate('/login');
            return;
        }

        // Fetch product data to match with cart items
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error('Error fetching products.');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();

        // Load cart items from localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
        setCartItems(savedCart);
    }, [navigate]);

    const getProductName = (productId) => {
        const product = products.find(p => p._id === productId);
        return product ? product.name : 'Unknown Product';
    };

    const getProductPrice = (productId) => {
        const product = products.find(p => p._id === productId);
        return product ? product.price : 0;
    };

    const calculateTotal = () => {
        return Object.keys(cartItems).reduce((total, productId) => {
            const quantity = cartItems[productId];
            const price = getProductPrice(productId);
            return total + (price * quantity);
        }, 0);
    };

    const calculateGST = (amount) => {
        return amount * GST_RATE;
    };

    const calculateDiscount = (amount) => {
        return amount * DISCOUNT_RATE;
    };

    const totalWithoutDiscount = calculateTotal();
    const discountAmount = calculateDiscount(totalWithoutDiscount);
    const totalAfterDiscount = totalWithoutDiscount - discountAmount;
    const gstAmount = calculateGST(totalAfterDiscount);
    const totalWithGST = totalAfterDiscount + gstAmount;

    const isCartEmpty = Object.keys(cartItems).length === 0;

    return (
        <div className="cart">
            <h1>Shopping Cart</h1>
            <div className="cart-items">
                {isCartEmpty ? (
                    <p>Your cart is empty.</p>
                ) : (
                    Object.keys(cartItems).map(productId => (
                        <div key={productId} className="cart-item">
                            <p className="product-name">{getProductName(productId)}</p>
                            <p className="product-quantity">Quantity: {cartItems[productId]}</p>
                            <p className="product-price">Price: INR {getProductPrice(productId)}</p>
                            <p className="item-total">Total: INR {getProductPrice(productId) * cartItems[productId]}</p>
                        </div>
                    ))
                )}
            </div>
            {!isCartEmpty && (
                <div className="cart-summary">
                    <h2>Subtotal: INR {totalWithoutDiscount.toFixed(2)}</h2>
                    <h3 className='discount-color'>Discount (20%): INR {discountAmount.toFixed(2)}</h3>
                    <h2>Subtotal After Discount: INR {totalAfterDiscount.toFixed(2)}</h2>
                    <h3 className='gst-color'>GST (18%): INR {gstAmount.toFixed(2)}</h3>
                    <h2>Total (Including GST): INR {totalWithGST.toFixed(2)}</h2>
                    <Link to="/checkout">
                        <button className='cart-button' disabled={isCartEmpty}>Proceed to Checkout</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cart;
