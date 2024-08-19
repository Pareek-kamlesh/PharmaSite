import React from 'react';

const Product = ({ product }) => {
    return (
        <div className="product">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>In Stock: {product.stock}</p>
        </div>
    );
};

export default Product;
