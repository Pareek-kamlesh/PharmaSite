import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Checkout.css';

const GST_RATE = 0.18; // 18% GST
const DISCOUNT_RATE = 0.20; // 20% Discount

const Checkout = () => {
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
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

        const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
        setCartItems(savedCart);
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !address || !phone) {
            setError('All fields are required.');
            return;
        }

        const cartItemsArray = Object.keys(cartItems).map(productId => ({
            productId,
            quantity: cartItems[productId],
        }));

        try {
            const response = await fetch('/api/orders/placeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    cartItems: cartItemsArray,
                    name,
                    email,
                    address,
                    phone,
                    total: totalWithGST,
                    discount: discountAmount,
                    gst: gstAmount,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order.');
            }

            // Handle successful order placement
            toast.success('Order placed successfully!');
            localStorage.removeItem('cart');
            navigate('/');
        } catch (err) {
            console.error('Error placing order:', err);
            setError(err.message || 'Failed to place order. Please try again.');
        }
    };

    return (
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout-summary">
                <h2>Order Summary</h2>
                {Object.keys(cartItems).length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className="summary-items">
                        {Object.keys(cartItems).map(productId => (
                            <div key={productId} className="summary-item">
                                <p className="product-name">{getProductName(productId)}</p>
                                <p className="product-quantity">Quantity: {cartItems[productId]}</p>
                                <p className="product-price">Price: INR {getProductPrice(productId)}</p>
                                <p className="item-total">Total: INR {getProductPrice(productId) * cartItems[productId]}</p>
                            </div>
                        ))}
                    </div>
                )}
                <h2>Subtotal: INR {totalWithoutDiscount}</h2>
                <h3>Discount (20%): INR {discountAmount.toFixed(2)}</h3>
                <h2>Subtotal After Discount: INR {totalAfterDiscount.toFixed(2)}</h2>
                <h3>GST (18%): INR {gstAmount.toFixed(2)}</h3>
                <h2>Total (Including GST): INR {totalWithGST.toFixed(2)}</h2>
            </div>
            <form className="checkout-form" onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Shipping Address</label>
                    <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button className='checkout-button' type="submit">Place Order</button>
            </form>
        </div>
    );
};

export default Checkout;