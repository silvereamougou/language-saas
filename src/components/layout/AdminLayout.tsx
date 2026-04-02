import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Package, Menu, X, User } from 'lucide-react';
import { ThemeSwitcher } from '../ui';
import { Popover } from 'antd';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLoginPage from '../../pages/admin/AdminLoginPage';

const AdminLayout: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin/products', label: 'Products', icon: <Package size={20} /> },
        { path: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { isAdminAuthenticated, logoutAdmin } = useAdminAuth();

    if (!isAdminAuthenticated) {
        return <AdminLoginPage />;
    }

    return (
        <div className="flex h-screen bg-surface-primary text-text-primary overflow-hidden transition-colors duration-300">
            {/* Desktop Sidebar */}
            <div className={`w-64 bg-surface-primary border-r border-(--border-color) hidden md:flex flex-col shrink-0 transition-colors duration-300`}>
                <div className="h-20 flex items-center px-6 border-b border-(--border-color)">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-(--icon-color) rounded-lg flex items-center justify-center text-(--bg-primary) font-black group-hover:scale-105 transition-transform">
                            D
                        </div>
                        <span className="font-black text-xl tracking-tighter">Dashboard</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname.startsWith(item.path)
                                ? 'bg-(--text-primary) text-(--bg-primary) shadow-md shadow-black/10'
                                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-(--border-color) space-y-4">
                    <button onClick={logoutAdmin} className="w-full flex items-center gap-2 text-sm text-text-muted hover:text-red-500 font-bold px-2 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
                        <ArrowLeft size={16} /> Secure Logout
                    </button>
                    <Link to="/" className="w-full flex items-center gap-2 text-sm text-text-muted hover:text-text-primary font-bold px-2 py-2 rounded-lg hover:bg-surface-primary transition-colors">
                        Exit Dashboard
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden bg-black/50" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-64 bg-surface-primary h-full flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="h-20 flex items-center justify-between px-6 border-b border-(--border-color)">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-(--icon-color) rounded-lg flex items-center justify-center text-(--bg-primary) font-black">
                                    D
                                </div>
                                <span className="font-black text-xl">Dashboard</span>
                            </Link>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-text-muted">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname.startsWith(item.path)
                                        ? 'bg-(--text-primary) text-(--bg-primary)'
                                        : 'text-text-secondary'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile & Desktop Top Nav */}
                <div className="h-16 md:h-20 bg-surface-primary border-b border-(--border-color) flex justify-between items-center px-4 md:px-8 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-text-primary" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg md:text-xl font-black uppercase tracking-tight truncate">
                            {menuItems.find(m => location.pathname.startsWith(m.path))?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Action button rendering portal target - will be populated by active page */}
                        <div id="admin-mobile-action-portal" className="flex items-center"></div>

                        <Popover
                            content={
                                <div className="flex flex-col gap-2 p-1 min-w-[120px]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-[#64748B]">Theme</span>
                                        <ThemeSwitcher />
                                    </div>
                                </div>
                            }
                            trigger="click"
                            placement="bottomRight"
                        >
                            <button className="w-10 h-10 rounded-full bg-surface-secondary border border-(--border-color) flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-primary transition-all">
                                <User size={20} />
                            </button>
                        </Popover>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
