import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        toast.warning("Logged out Successfully!")
        navigate('/login');
    };

    return (
        <header>
            <nav>
                <img src="https://res.cloudinary.com/mela-techologies-inc/image/upload/c_fit,g_center,h_512,w_512,q_auto,f_auto/v1676457297/logos/3e943264-85f3-4bd0-b593-afdc77b5e695_veqbib.png" alt="stanfy" />
                <h1>Stanfy Biotech</h1>
                <Link to="/">Home</Link>
                <Link to="/cart">Cart</Link> {/* Added Cart link */}
                <div className="auth-links">
                    {userInfo ? (
                        <button className="logout-btn" onClick={logoutHandler}>Logout</button>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
