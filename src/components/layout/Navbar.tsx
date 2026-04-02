import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, Languages, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { Button, ThemeSwitcher } from '../ui';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { Dropdown } from 'antd';

const Navbar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useUser();
    const { cartCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: t('nav.products'), href: '/products' },
        { name: t('nav.about'), href: '/about' },
        { name: t('nav.affiliation'), href: '/affiliation' },
        { name: t('nav.contact'), href: '/contact' },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(nextLang);
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: (
                <div className="px-4 py-3 border-b border-(--border-color) mb-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="font-bold text-text-primary truncate max-w-[200px]">{user?.name}</p>
                    <p className="text-[10px] text-text-muted truncate mb-2">{user?.email}</p>
                </div>
            ),
        },
        {
            key: 'orders',
            label: (
                <Link to="/orders" className="flex items-center gap-2 px-4 py-2 hover:text-(--icon-color) transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ShoppingBag size={14} /> My Library
                </Link>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: (
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-400 transition-colors font-bold uppercase text-[10px] tracking-widest w-full text-left"
                >
                    <LogOut size={14} /> {t('nav.logout') || 'Sign Out'}
                </button>
            ),
        },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
                isScrolled
                    ? 'bg-(--surface-primary)/90 backdrop-blur-xl border-b border-(--border-color) shadow-lg'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 bg-(--icon-color) rounded-xl flex items-center justify-center font-extrabold text-(--surface-primary) shadow-lg transition-shadow">
                        D
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-(--text-primary) to-(--text-secondary)">
                        DIGIELEARNING
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.href}
                            to={link.href}
                            className={({ isActive }) =>
                                cn(
                                    'text-sm font-medium transition-colors relative',
                                    isActive ? 'text-(--text-primary)' : 'text-(--text-secondary) hover:text-(--text-primary)'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-(--icon-color) rounded-full"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-(--surface-secondary) text-(--text-secondary) hover:text-(--text-primary) transition-all text-sm font-medium uppercase tracking-wider cursor-pointer"
                    >
                        <Languages size={18} className="text-(--icon-color)" />
                        {i18n.language === 'en' ? 'FR' : 'EN'}
                    </button>

                    <Link
                        to="/orders"
                        className="relative p-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors group"
                    >
                        <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-(--icon-color) text-[10px] font-black text-(--surface-primary) rounded-full flex items-center justify-center border border-(--surface-primary)">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <ThemeSwitcher />

                    {user ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']} overlayClassName="premium-user-dropdown">
                            <button className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-surface-secondary border border-(--border-color) hover:border-(--icon-color) transition-all cursor-pointer">
                                <span className="text-xs font-bold text-text-primary capitalize">{user.name.split(' ')[0]}</span>
                                <div className="w-8 h-8 rounded-full bg-(--icon-color) text-(--surface-primary) flex items-center justify-center font-black text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={14} className="text-text-muted mr-1" />
                            </button>
                        </Dropdown>
                    ) : (
                        <Button size="sm" className="hidden xl:flex">{t('nav.get_started')}</Button>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="flex lg:hidden items-center gap-2">
                    <ThemeSwitcher />
                    <button
                        className="text-(--text-primary) p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-(--surface-primary)/95 backdrop-blur-xl border-b border-(--border-color) px-6 py-8 flex flex-col gap-5 lg:hidden"
                    >
                        {user && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-secondary mb-2">
                                <div className="w-12 h-12 rounded-xl bg-(--icon-color) text-(--surface-primary) flex items-center justify-center font-black text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-text-primary uppercase tracking-tight truncate">{user.name}</p>
                                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={({ isActive }) =>
                                    cn(
                                        'text-lg font-medium transition-colors',
                                        isActive ? 'text-(--text-primary)' : 'text-(--text-secondary) hover:text-(--text-primary)'
                                    )
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <Link
                            to="/orders"
                            className="text-lg font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors flex items-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <ShoppingBag size={20} /> My Library ({cartCount})
                        </Link>

                        {user ? (
                            <button
                                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                className="text-lg font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 mt-4"
                            >
                                <LogOut size={20} /> Sign Out
                            </button>
                        ) : (
                            <Button className="w-full mt-2">{t('nav.get_started')}</Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
