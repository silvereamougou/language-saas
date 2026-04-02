import React, { useState } from 'react';
import { Drawer, message } from 'antd';
import { ShoppingCart, Trash2, ShieldCheck, X, Briefcase, Plus, Minus } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useApi } from '../../../context/ApiContext';
import { useUser } from '../../../context/UserContext';
import IdentityModal from '../checkout/IdentityModal';

const CartDrawer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartItems, removeFromCart, totalAmount, cartCount, clearCart } = useCart();
    const { createOrder } = useApi();
    const { user } = useUser();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isIdentityModalVisible, setIsIdentityModalVisible] = useState(false);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        if (!user) {
            setIsIdentityModalVisible(true);
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
                    transactionId: `CART-TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    hasAccess: true
                });
            }
            message.success(`Thanks ${user.name}! Your orders have been placed.`);
            clearCart();
            setIsOpen(false);
        } catch (err) {
            message.error('Checkout failed');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <>
            {/* Floating Cart Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-(--icon-color) text-(--bg-primary) rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all group"
            >
                <div className="relative">
                    <ShoppingCart size={24} strokeWidth={2.5} />
                    {cartCount > 0 && (
                        <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-(--bg-primary) animate-in zoom-in duration-300">
                            {cartCount}
                        </span>
                    )}
                </div>
            </button>

            <Drawer
                title={null}
                placement="right"
                onClose={() => setIsOpen(false)}
                open={isOpen}
                width={400}
                className="premium-cart-drawer"
                styles={{
                    body: { padding: 0, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' },
                    mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.4)' }
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 border-b border-(--border-color) flex items-center justify-between bg-surface-primary">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-(--icon-color)/10 text-(--icon-color)">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-tight leading-none">Your Cart</h2>
                                <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase mt-1">{cartCount} Items Selected</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-surface-secondary flex items-center justify-center text-text-muted transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-(--border-color) flex items-center justify-center">
                                    <ShoppingCart size={32} />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest">Cart is empty</p>
                            </div>
                        ) : (
                            cartItems.map((item: any) => (
                                <div key={item._id} className="p-4 rounded-2xl bg-surface-secondary border border-(--border-color) flex gap-4 group">
                                    <div className="w-16 h-16 rounded-xl bg-surface-primary overflow-hidden border border-(--border-color) shrink-0">
                                        <img src={item.image || item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-text-primary uppercase tracking-tight truncate">{item.name}</h4>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">XAF {new Intl.NumberFormat().format(item.price)}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <button className="w-6 h-6 rounded-lg bg-surface-primary border border-(--border-color) flex items-center justify-center text-text-muted hover:text-(--icon-color) transition-colors">
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-xs font-black">{item.quantity}</span>
                                            <button className="w-6 h-6 rounded-lg bg-surface-primary border border-(--border-color) flex items-center justify-center text-text-muted hover:text-(--icon-color) transition-colors">
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="h-fit p-2 text-text-muted hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-8 bg-surface-primary border-t border-(--border-color) space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Total Amount</span>
                                <span className="text-2xl font-black text-text-primary tracking-tighter">XAF {new Intl.NumberFormat().format(totalAmount)}</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className={`w-full h-16 bg-(--text-primary) text-(--bg-primary) rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:opacity-90 transition-all ${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                                >
                                    {isCheckingOut ? 'Processing...' : (
                                        <>Place Orders <ShieldCheck size={20} /></>
                                    )}
                                </button>
                                {user && (
                                    <p className="text-[9px] text-center text-text-muted font-bold uppercase tracking-widest">
                                        Ordering as {user.name} ({user.email})
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Drawer>

            <IdentityModal
                visible={isIdentityModalVisible}
                onClose={() => setIsIdentityModalVisible(false)}
                onSuccess={handleCheckout}
            />
        </>
    );
};

export default CartDrawer;
