import { ShoppingBag, TrendingUp, Users, DollarSign, Plus, X, Receipt } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { useApi } from '../../context/ApiContext';
import React, { useState } from 'react';
import { message } from 'antd';

const AdminOrdersPage: React.FC = () => {
    const { orders, isLoading, refresh: refreshOrders } = useOrders();
    const { products } = useProducts();
    const { createManualOrder } = useApi();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        userEmail: '',
        productId: '',
        amount: 0,
        status: 'success'
    });

    const handleCreateInvoice = async () => {
        if (!formData.userEmail || !formData.productId) {
            message.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSaving(true);
            await createManualOrder(formData);
            message.success('Custom invoice created successfully!');
            setIsModalOpen(false);
            setFormData({ userEmail: '', productId: '', amount: 0, status: 'success' });
            refreshOrders();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            message.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculated stats from real data
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    const stats = [
        { title: 'Total Orders', value: orders.length.toString(), icon: <ShoppingBag size={24} />, color: 'text-(--text-primary)', bg: 'bg-(--icon-color)/20' },
        { title: 'Revenue', value: `XAF ${new Intl.NumberFormat().format(totalRevenue)}`, icon: <DollarSign size={24} />, color: 'text-(--text-secondary)', bg: 'bg-(--icon-color)/10' },
        { title: 'Customers', value: new Set(orders.map(o => o.email)).size.toString(), icon: <Users size={24} />, color: 'text-(--icon-color)', bg: 'bg-(--icon-color)/10' },
        { title: 'Growth', value: '+5.2%', icon: <TrendingUp size={24} />, color: 'text-(--text-primary)', bg: 'bg-(--icon-color)/20' },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-surface-secondary border border-(--border-color) rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-black text-text-primary tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-surface-secondary border border-(--border-color) rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-(--border-color) flex justify-between items-center">
                    <h2 className="text-lg font-black uppercase tracking-tight">Recent Orders</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-(--icon-color) hover:opacity-90 rounded-xl text-sm font-black text-(--bg-primary) transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={16} /> Add Custom Invoice
                        </button>
                        <button className="px-4 py-2 bg-surface-primary hover:bg-surface-secondary border border-(--border-color) rounded-xl text-sm font-bold text-text-primary transition-colors">
                            View All
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {/* Desktop Table View */}
                    <table className="w-full text-left border-collapse hidden md:table">
                        <thead>
                            <tr className="bg-surface-primary/50 text-text-muted text-xs uppercase tracking-widest">
                                <th className="p-4 font-bold">Order ID</th>
                                <th className="p-4 font-bold">Customer</th>
                                <th className="p-4 font-bold">Product</th>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Amount</th>
                                <th className="p-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium divide-y divide-(--border-color)">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-text-muted italic">Fetching live orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-text-muted">No orders found in database.</td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order._id} className="hover:bg-surface-primary/30 transition-colors">
                                    <td className="p-4 text-text-primary font-bold">#{order._id.slice(-6).toUpperCase()}</td>
                                    <td className="p-4 text-text-secondary">{order.email}</td>
                                    <td className="p-4 text-text-secondary max-w-[200px] truncate" title={order.productName || (typeof order.productId === 'object' ? order.productId.name : '')}>{order.productName || (typeof order.productId === 'object' ? order.productId.name : 'Product')}</td>
                                    <td className="p-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-text-primary font-bold">XAF {new Intl.NumberFormat().format(order.amount)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden flex flex-col divide-y divide-(--border-color)">
                        {orders.map((order) => (
                            <div key={order._id} className="p-5 flex flex-col gap-3 hover:bg-surface-primary/30 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-black text-text-primary tracking-tight">#{order._id.slice(-6).toUpperCase()}</div>
                                        <div className="text-xs text-text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-text-primary line-clamp-1">{order.productName || (typeof order.productId === 'object' ? order.productId.name : 'Product')}</div>
                                    <div className="text-xs text-text-secondary mt-0.5">{order.email}</div>
                                </div>
                                <div className="text-sm font-black text-text-primary pt-1">
                                    XAF {new Intl.NumberFormat().format(order.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="h-4"></div>
            </div>

            {/* Manual Invoice Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-surface-secondary rounded-[40px] border border-(--border-color) shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
                                    <Receipt size={24} className="text-(--icon-color)" /> Manual Invoice
                                </h3>
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Record an offline sale or grant product access</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-primary rounded-xl text-text-muted transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-1">Customer Email</label>
                                <input
                                    type="email"
                                    className="w-full h-14 px-4 rounded-xl bg-surface-primary border border-(--border-color) text-text-primary outline-none focus:border-(--icon-color) transition-all text-sm font-medium"
                                    placeholder="customer@example.com"
                                    value={formData.userEmail}
                                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-1">Product</label>
                                <select
                                    className="w-full h-14 px-4 rounded-xl bg-surface-primary border border-(--border-color) text-text-primary outline-none focus:border-(--icon-color) transition-all text-xs font-black uppercase tracking-widest"
                                    value={formData.productId}
                                    onChange={(e) => {
                                        const p = products.find(x => x._id === e.target.value);
                                        setFormData({ ...formData, productId: e.target.value, amount: p?.price || 0 });
                                    }}
                                >
                                    <option value="" disabled>Select Product</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} (XAF {new Intl.NumberFormat().format(p.price)})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-1">Amount (XAF)</label>
                                    <input
                                        type="number"
                                        className="w-full h-14 px-4 rounded-xl bg-surface-primary border border-(--border-color) text-text-primary outline-none focus:border-(--icon-color) transition-all text-sm font-bold"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-1">Status</label>
                                    <select
                                        className="w-full h-14 px-4 rounded-xl bg-surface-primary border border-(--border-color) text-text-primary outline-none focus:border-(--icon-color) transition-all text-xs font-black uppercase tracking-widest"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="success">Success</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateInvoice}
                                disabled={isSaving}
                                className={`w-full h-16 bg-(--text-primary) text-(--bg-primary) rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'}`}
                            >
                                {isSaving ? 'Creating...' : <>Grant Access & Record Sale <Receipt size={18} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
