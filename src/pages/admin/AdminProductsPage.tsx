import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { message } from 'antd';

const AdminProductsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { products, isLoading, error, removeProduct } = useProducts();

    const filteredProducts = products.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();
    // Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const confirmDelete = (id: string) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (productToDelete) {
            try {
                await removeProduct(productToDelete);
                message.success('Product deleted successfully');
            } catch (err: any) {
                console.error(err);
                message.error(err.message || 'Failed to delete product');
            } finally {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
            }
        }
    };

    const openAddModal = () => {
        navigate('/admin/products/new');
    };

    const openEditModal = (product: Product) => {
        navigate(`/admin/products/edit/${product._id}`);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-[var(--text-primary)] transition-colors duration-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-secondary border border-(--border-color) text-text-primary placeholder-text-muted outline-none hover:border-[var(--text-primary)] focus:border-[var(--text-primary)] focus:bg-surface-primary focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] transition-all font-bold text-sm"
                    />
                </div>

                <button onClick={openAddModal} className="flex justify-center items-center gap-2 px-6 py-3 bg-[var(--text-primary)] hover:opacity-90 text-[var(--bg-primary)] font-black uppercase tracking-widest text-[11px] rounded-xl transition-all shadow-lg shadow-black/10 active:scale-[0.98] whitespace-nowrap">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* Products Grid / Table layout */}
            <div className="bg-surface-secondary border border-(--border-color) rounded-3xl overflow-hidden shadow-sm pt-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px] hidden md:table">
                        <thead>
                            <tr className="bg-surface-primary/50 text-text-muted text-xs uppercase tracking-widest border-b border-(--border-color)">
                                <th className="p-4 font-bold pl-6">Product</th>
                                <th className="p-4 font-bold w-32">Price</th>
                                <th className="p-4 font-bold w-40">Category</th>
                                <th className="p-4 font-bold w-32">Status</th>
                                <th className="p-4 font-bold w-32 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-(--border-color)">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} onClick={() => navigate(`/admin/products/${product._id}`)} className="hover:bg-surface-primary/30 transition-colors group cursor-pointer">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-primary border border-(--border-color) shrink-0">
                                                <img src={product.image || product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text-primary truncate max-w-[300px]" title={product.name}>{product.name}</h4>
                                                <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                                                    ID: {(product._id || '').slice(-6).toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-black tracking-tighter text-text-primary">
                                        <div className="flex flex-col">
                                            {product.promotionPrice ? (
                                                <>
                                                    <span className="text-emerald-500">XAF {new Intl.NumberFormat().format(product.promotionPrice)}</span>
                                                    <span className="text-[10px] text-text-muted line-through opacity-60">XAF {new Intl.NumberFormat().format(product.price)}</span>
                                                </>
                                            ) : (
                                                <span>XAF {new Intl.NumberFormat().format(product.price)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 rounded-md bg-surface-primary border border-(--border-color) text-xs font-bold text-text-secondary whitespace-nowrap">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' :
                                            product.status === 'Draft' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {product.status || 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); openEditModal(product); }} className="p-2 text-text-muted hover:text-[var(--icon-color)] bg-surface-primary rounded-lg transition-colors border border-(--border-color) hover:border-[var(--icon-color)]" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${product._id}`); }} className="p-2 text-text-muted hover:text-[var(--text-primary)] bg-surface-primary rounded-lg transition-colors border border-(--border-color)" title="View Detail">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); confirmDelete(product._id); }} className="p-2 text-text-muted hover:text-red-500 bg-surface-primary rounded-lg transition-colors border border-(--border-color) hover:border-red-500/30" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Cards View */}
                    <div className="md:hidden flex flex-col divide-y divide-(--border-color)">
                        {filteredProducts.map((product) => (
                            <div key={product._id} onClick={() => navigate(`/admin/products/${product._id}`)} className="p-4 flex flex-col gap-4 cursor-pointer hover:bg-surface-primary/30 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-surface-primary border border-(--border-color) shrink-0 overflow-hidden">
                                            <img src={product.image || product.thumbnail} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-text-primary line-clamp-1">{product.name}</h4>
                                            <p className="text-[10px] text-text-muted mt-0.5">ID: {product.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-black text-text-primary text-sm">XAF {new Intl.NumberFormat().format(product.price)}</div>
                                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-(--border-color)/50">
                                    <span className="px-2.5 py-1 rounded-md bg-surface-primary border border-(--border-color) text-[9px] font-bold text-text-secondary whitespace-nowrap">
                                        {product.category}
                                    </span>

                                    <div className="flex gap-1.5">
                                        <button onClick={(e) => { e.stopPropagation(); openEditModal(product); }} className="p-2 text-text-muted bg-surface-primary rounded-lg border border-(--border-color)">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${product._id}`); }} className="p-2 text-text-muted bg-surface-primary rounded-lg border border-(--border-color)">
                                            <ExternalLink size={14} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); confirmDelete(product._id); }} className="p-2 text-red-500 bg-surface-primary rounded-lg border border-(--border-color)">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-text-muted font-bold text-sm">Fetching products from server...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center flex flex-col items-center bg-red-500/5">
                            <p className="text-red-500 font-bold mb-2">Error connecting to backend</p>
                            <p className="text-text-muted text-xs">{error}</p>
                        </div>
                    ) : filteredProducts.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-surface-primary rounded-full flex items-center justify-center mb-4 text-text-muted border border-(--border-color)">
                                <Search size={24} />
                            </div>
                            <p className="text-text-primary font-bold text-lg">No products found.</p>
                            <p className="text-text-muted text-sm mt-1">Try adjusting your search query.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-surface-primary w-full max-w-sm rounded-3xl border border-(--border-color) shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-2">Delete Product?</h3>
                                <p className="text-sm font-medium text-text-secondary leading-relaxed">
                                    This action cannot be undone. Are you sure you want to permanently delete this product?
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-(--border-color) flex justify-end gap-3 bg-surface-secondary">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-primary border border-(--border-color) hover:bg-surface-primary transition-colors">
                                Cancel
                            </button>
                            <button onClick={executeDelete} className="px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs bg-red-500 text-white hover:bg-red-600 transition-colors">
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminProductsPage;
