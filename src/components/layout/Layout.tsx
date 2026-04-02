import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PageLoader } from '../ui';
import CartDrawer from '../features/products/CartDrawer';

const Layout: React.FC = () => {
    const location = useLocation();
    const [prevPath, setPrevPath] = useState(location.pathname);
    const [isNavigating, setIsNavigating] = useState(false);

    if (location.pathname !== prevPath) {
        setPrevPath(location.pathname);
        setIsNavigating(true);
    }

    useEffect(() => {
        if (isNavigating) {
            const timer = setTimeout(() => setIsNavigating(false), 800);
            return () => clearTimeout(timer);
        }
    }, [isNavigating]);

    return (
        <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) selection:bg-indigo-500/30 font-sans transition-colors duration-300">
            {isNavigating && <PageLoader />}
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <CartDrawer />
            <Footer />
        </div>
    );
};

export default Layout;
