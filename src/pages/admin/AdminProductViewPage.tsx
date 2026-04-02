import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { ArrowLeft, Download, DollarSign, Layers, Activity, Plus } from 'lucide-react';
import { Badge, Input as UIInput } from '../../components/ui';
import type { Product, ProductVersion } from '../../types';

const AdminProductViewPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { product, isLoading, error, refresh } = useProduct(id) as any;
    const [isAddingVersion, setIsAddingVersion] = useState(false);
    const [newV, setNewV] = useState({ version: '', fileUrl: '', changelog: '' });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-40">
                <div className="w-12 h-12 border-4 border-(--icon-color) border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-6xl mx-auto text-center space-y-4 py-20 bg-red-500/5 rounded-3xl border border-red-500/20">
                <p className="text-red-500 text-xl font-bold">Product not found</p>
                <button onClick={() => navigate('/admin/products')} className="text-sm font-bold underline">Go back</button>
            </div>
        );
    }

    const handleAddVersion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/versions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newV),
            });
            if (!response.ok) throw new Error('Failed to add version');
            setIsAddingVersion(false);
            setNewV({ version: '', fileUrl: '', changelog: '' });
            refresh(); // Refresh product to show new version
        } catch (err) {
            alert('Error adding version');
        }
    };

    const downloads = product.totalSales || 0;
    const gained = product.revenue || 0;

    // Use versions from server if available
    const versions: ProductVersion[] = (product as any).versions || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-16">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-text-muted hover:text-(--text-primary) transition-colors font-bold text-sm"
            >
                <ArrowLeft size={18} /> Back to Products
            </button>

            {/* Product Header */}
            <div className="p-8 rounded-[40px] bg-surface-secondary border border-(--border-color) flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-(--icon-color)/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative w-32 h-32 rounded-3xl bg-surface-primary border border-(--border-color) p-2 shrink-0">
                    <img src={product.image || product.thumbnail} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                </div>

                <div className="flex-1 space-y-2 relative">
                    <div className="flex items-center gap-3">
                        <Badge variant="status">{product.category}</Badge>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' :
                                product.status === 'Draft' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-red-500/10 text-red-500'
                            }`}>
                            {product.status}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight">{product.name}</h2>
                    <p className="text-text-muted text-sm font-medium leading-relaxed max-w-2xl">{product.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Dashboard */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: <Download size={20} />, label: 'Total Sales', value: downloads, color: 'text-indigo-500' },
                            { icon: <DollarSign size={20} />, label: 'Revenue', value: `XAF ${new Intl.NumberFormat().format(gained)}`, color: 'text-emerald-500' },
                            { icon: <Layers size={20} />, label: 'Versions', value: versions.length, color: 'text-(--icon-color)' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-surface-primary border border-(--border-color) space-y-4">
                                <div className={`w-10 h-10 rounded-2xl bg-surface-secondary flex items-center justify-center ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black text-text-primary tracking-tighter">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart Placeholder */}
                    <div className="p-8 rounded-[40px] bg-surface-primary border border-(--border-color) h-80 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <h3 className="text-text-primary font-bold text-lg uppercase tracking-wider text-sm opacity-80">Store Performance</h3>
                            <select className="bg-surface-secondary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-(--border-color) outline-none">
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-end gap-2 px-4 py-8">
                            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-lg relative group h-full">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg group-hover:bg-(--icon-color) transition-all duration-500"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Versions Sidebar */}
                <div className="space-y-6">
                    <div className="p-6 rounded-[40px] bg-surface-primary border border-(--border-color) space-y-6">
                        <div className="flex items-center justify-between border-b border-(--border-color) pb-4">
                            <h3 className="text-text-primary font-bold text-lg uppercase tracking-wider text-sm opacity-80 flex items-center gap-2">
                                <Layers size={18} /> Release Versions
                            </h3>
                            <button
                                onClick={() => setIsAddingVersion(true)}
                                className="text-[10px] font-black uppercase tracking-widest text-[var(--icon-color)] hover:text-text-primary transition-colors flex items-center gap-1"
                            >
                                <Plus size={14} /> New Version
                            </button>
                        </div>

                        {isAddingVersion && (
                            <div className="p-4 rounded-2xl bg-surface-secondary border border-(--icon-color) space-y-4 animate-in fade-in slide-in-from-top-2">
                                <UIInput
                                    label="Version"
                                    placeholder="v1.0.0"
                                    value={newV.version}
                                    onChange={(e) => setNewV({ ...newV, version: e.target.value })}
                                />
                                <UIInput
                                    label="File URL"
                                    placeholder="https://..."
                                    value={newV.fileUrl}
                                    onChange={(e) => setNewV({ ...newV, fileUrl: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Changelog</label>
                                    <textarea
                                        className="w-full h-20 p-3 rounded-xl bg-surface-primary border border-(--border-color) text-xs"
                                        placeholder="What's new?"
                                        value={newV.changelog}
                                        onChange={(e) => setNewV({ ...newV, changelog: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleAddVersion}
                                        className="flex-1 h-10 bg-(--icon-color) text-(--bg-primary) rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsAddingVersion(false)}
                                        className="px-4 h-10 border border-(--border-color) rounded-xl font-black text-[10px] uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {versions.length === 0 ? (
                                <p className="text-center text-text-muted text-xs py-8">No versions released yet.</p>
                            ) : (
                                versions.map((v, i) => (
                                    <div key={v._id || i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-secondary border border-(--border-color) group hover:border-[var(--icon-color)] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[var(--icon-color)]/10 flex items-center justify-center text-[var(--icon-color)]">
                                                <Activity size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary text-sm">{v.version}</p>
                                                <p className="text-[10px] text-text-muted mt-0.5">
                                                    {new Date(v.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {v.isLatest && (
                                            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                LATEST
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductViewPage;
