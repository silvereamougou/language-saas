import { ShoppingBag, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';

const AdminOrdersPage: React.FC = () => {
    const { orders, isLoading, error } = useOrders();

    // Calculated stats from real data
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'success' || o.status === 'Completed').length;

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
                    <button className="px-4 py-2 bg-surface-primary hover:bg-surface-secondary border border-(--border-color) rounded-xl text-sm font-bold text-text-primary transition-colors">
                        View All
                    </button>
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
                                    <td className="p-4 text-text-secondary max-w-[200px] truncate" title={order.productName || (order.productId as any)?.name}>{order.productName || (order.productId as any)?.name || 'Product'}</td>
                                    <td className="p-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-text-primary font-bold">XAF {new Intl.NumberFormat().format(order.amount)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'success' || order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                            order.status === 'pending' || order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' :
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
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'success' || order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                        order.status === 'pending' || order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-text-primary line-clamp-1">{order.productName || (order.productId as any)?.name || 'Product'}</div>
                                    <div className="text-xs text-text-secondary mt-0.5">{order.email}</div>
                                </div>
                                <div className="text-sm font-black text-text-primary pt-1">
                                    XAF {new Intl.NumberFormat().format(order.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Empty Space for spacing */}
                <div className="h-4"></div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
