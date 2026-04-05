import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, PlusCircle, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SectionHeading, Button } from '../components/ui';
import OrderItem from '../components/features/orders/OrderItem';
import { useMyOrders } from '../hooks/useOrders';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useApi } from '../context/ApiContext';
import { message } from 'antd';

const MyOrdersPage: React.FC = () => {
    const { t } = useTranslation();
    const { user, customerToken } = useUser();
    const { cartItems, totalAmount, clearCart } = useCart();
    const { orders, isLoading, refresh } = useMyOrders();
    const { createOrder } = useApi();
    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

    // Sort by recent orders
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleCheckout = async () => {
        if (cartItems.length === 0 || !user) return;

        if (!customerToken) {
            // Should probably trigger login modal here instead
            alert("Your session expired. Please log in again to view your library.");
            return;
        }

        setIsCheckingOut(true);
        try {
            for (const item of cartItems) {
                await createOrder({
                    email: user.email,
                    productId: item._id,
                    amount: item.price,
                    status: 'success',
                    transactionId: `DASH-TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    hasAccess: true
                });
            }
            message.success(`Thanks ${user.name}! Your payment was successful.`);
            clearCart();
            // Refresh purchase history after successful order
            refresh();
        } catch (err) {
            message.error('Checkout failed');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="pt-28 pb-32 px-6 bg-(--bg-primary) transition-colors duration-300 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <SectionHeading
                        tag={user ? `SESSION: ${user.name}` : t('orders.tag')}
                        tagColor="text-(--icon-color)"
                        title={t('orders.title')}
                        description={user ? `Managing orders for ${user.email}` : t('orders.desc')}
                    />
                    <Link to="/products">
                        <Button variant="outline" className="h-14 px-8 font-black uppercase tracking-widest text-xs border-(--border-color) text-(--icon-color) hover:bg-(--icon-color) hover:text-(--bg-primary) transition-all">
                            <PlusCircle size={18} className="mr-2" /> {t('orders.browse')}
                        </Button>
                    </Link>
                </div>

                {/* Pending Selections (Cart Items) */}
                {cartItems.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-(--icon-color)/10 text-(--icon-color)">
                                <ShoppingCart size={20} />
                            </div>
                            <div className="text-xs font-black uppercase tracking-widest text-text-primary mb-2">Notice</div>
                            <div className="text-[10px] font-medium text-text-muted space-y-1">
                                <p>Signed as {user?.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cartItems.map((item, i) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-3xl bg-surface-secondary border border-(--border-color) relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-(--icon-color)/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-surface-primary border border-(--border-color) flex-shrink-0 overflow-hidden">
                                            <img src={item.image || item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-right text-text-primary text-sm font-bold uppercase tracking-widest">{user?.name || 'Customer'}</div>
                                            <div className="text-right text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">{user?.email || 'N/A'}</div>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">XAF {new Intl.NumberFormat().format(item.price)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full bg-(--icon-color)/10 text-(--icon-color) text-[9px] font-black uppercase tracking-widest">
                                            {item.quantity} Unit(s)
                                        </span>
                                        <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">In Cart</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl bg-(--surface-primary) border border-(--border-color) shadow-sm">
                            <div>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Total Pending</p>
                                <p className="text-2xl font-black text-text-primary tracking-tighter">XAF {new Intl.NumberFormat().format(totalAmount)}</p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className={`mt-4 md:mt-0 px-8 h-14 bg-(--text-primary) text-(--bg-primary) rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:opacity-90 transition-all ${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                            >
                                {isCheckingOut ? 'Processing Payment...' : (
                                    <>Complete Payment <ShieldCheck size={18} /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Successful Purchases */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                        <Package size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Purchase History</h3>
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                        <div className="w-12 h-12 border-4 border-(--text-primary) border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">Syncing History...</p>
                    </div>
                )}

                {!isLoading && sortedOrders.length > 0 ? (
                    <div className="space-y-6">
                        {sortedOrders.map((order, i) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <OrderItem order={order as any} />
                            </motion.div>
                        ))}
                    </div>
                ) : !isLoading && cartItems.length === 0 && (
                    <div className="text-center py-32 px-12 rounded-[40px] bg-surface-secondary border-dashed border-2 border-(--border-color)">
                        <div className="w-24 h-24 bg-surface-primary border border-(--border-color) shadow-2xl rounded-full flex items-center justify-center mx-auto mb-8 text-text-muted">
                            <ShoppingBag size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-text-primary mb-4 uppercase tracking-tighter">Your Library is Empty</h3>
                        <p className="text-text-secondary max-w-sm mx-auto mb-10 leading-relaxed font-medium">Identify yourself and start selecting premium courses to see them here.</p>
                        <Link to="/products">
                            <Button size="lg" className="h-16 px-12 text-lg font-black uppercase tracking-widest bg-(--text-primary) hover:opacity-90 text-(--bg-primary) shadow-xl shadow-black/10">
                                <PlusCircle size={22} className="mr-2" /> {t('orders.browse')}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
