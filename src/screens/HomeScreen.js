import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';
import { toast } from 'react-toastify';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || {});
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            toast.error('Please log in to access the Home Screen.');
            navigate('/login');
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    setError('Error fetching products.');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again.');
            }
        };

        fetchProducts();
    }, [navigate]);

    const handleQuantityChange = (id, quantity) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart, [id]: quantity };
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const handleAddToCart = (product) => {
        const quantity = cart[product._id] || 1;
        handleQuantityChange(product._id, quantity);
        toast.success(`${product.name} added to cart.`);
    };

    const handleIncrement = (id) => {
        setCart(prevCart => {
            const newQuantity = (prevCart[id] || 1) + 1;
            handleQuantityChange(id, newQuantity);
            return { ...prevCart, [id]: newQuantity };
        });
    };

    const handleDecrement = (id) => {
        setCart(prevCart => {
            const currentQuantity = prevCart[id] || 1;
            if (currentQuantity > 1) {
                const newQuantity = currentQuantity - 1;
                handleQuantityChange(id, newQuantity);
                return { ...prevCart, [id]: newQuantity };
            }
            return prevCart;
        });
    };

    return (
        <div className="home-screen">
            {error && <p className="error-message">{error}</p>}
            <div className="product-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">Rs. {product.price}</p>
                            <p className="product-stock">In Stock: {product.stock}</p>
                            <div className="quantity-controls">
                                <button 
                                    className="quantity-button" 
                                    onClick={() => handleDecrement(product._id)}
                                >-</button>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={cart[product._id] || 1}
                                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                />
                                <button 
                                    className="quantity-button" 
                                    onClick={() => handleIncrement(product._id)}
                                >+</button>
                            </div>
                            <button className='add-cart-button' onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeScreen;
