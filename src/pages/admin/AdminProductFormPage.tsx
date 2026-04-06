import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../../types';
import { useProduct } from '../../hooks/useProducts';
import { useApi } from '../../context/ApiContext';
import { Input, ImagePicker } from '../../components/ui';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = [
    'Web Development',
    'Artificial Intelligence',
    'Design',
    'Cybersecurity',
    'Data Science',
    'Mobile Development',
    'Cloud',
    'Marketing'
];

const AdminProductFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { saveProduct } = useApi();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const { product: serverProduct, isLoading } = useProduct(id);

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
        name: '', price: 0, promotionPrice: 0, category: '', image: '', thumbnail: '', gallery: [], rating: 5.0, reviews: 0, description: '', status: 'Draft'
    });

    // Update state when server data is loaded
    React.useEffect(() => {
        if (serverProduct) {
            setEditingProduct(serverProduct);
        }
    }, [serverProduct]);

    const handleGalleryChange = (val: string | null, index: number) => {
        const newGallery = [...(editingProduct.gallery || [])];
        if (val) {
            newGallery[index] = val;
        } else {
            newGallery.splice(index, 1);
        }
        setEditingProduct({ ...editingProduct, gallery: newGallery });
    };

    const addGalleryImage = () => {
        setEditingProduct({ ...editingProduct, gallery: [...(editingProduct.gallery || []), ''] });
    };

    const saveProductAction = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);

            await saveProduct(editingProduct, id);
            navigate('/admin/products');
        } catch (err: any) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-16">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-text-muted hover:text-(--text-primary) transition-colors font-bold text-sm"
            >
                <ArrowLeft size={18} /> Back to Products
            </button>

            <div className="bg-surface-secondary  p-8 ">
                <h2 className="text-text-primary font-black text-2xl lg:text-3xl mb-2 uppercase tracking-tighter">
                    {isEdit ? 'Edit Product' : 'Product Setup'}
                </h2>
                <p className="text-text-muted text-sm font-medium mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                    Configuration details for your product.
                </p>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Images */}
                    <div className="flex-1 space-y-8">
                        <div className="p-6 rounded-3xl bg-surface-primary border border-(--border-color) space-y-6">
                            <h3 className="text-text-primary font-bold text-lg uppercase tracking-wider text-sm opacity-80 border-b border-(--border-color) pb-4">
                                Product Media
                            </h3>

                            <ImagePicker
                                label="Main Thumbnail"
                                value={editingProduct?.thumbnail || editingProduct?.image || ''}
                                onChange={(val) => setEditingProduct({ ...editingProduct, thumbnail: val || '', image: val || '' })}
                                className="h-64"
                            />

                            <div className="space-y-4">
                                <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">
                                    Gallery Images
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {(editingProduct.gallery || []).map((img: string, idx: number) => (
                                        <ImagePicker
                                            key={`gallery-${idx}`}
                                            value={img}
                                            onChange={(val) => handleGalleryChange(val, idx)}
                                        />
                                    ))}
                                    <button
                                        onClick={addGalleryImage}
                                        className="w-full h-32 rounded-2xl border-2 border-dashed border-input-border hover:border-text-muted/50 hover:bg-surface-secondary flex items-center justify-center text-text-muted transition-colors hover:text-text-primary"
                                    >
                                        <span className="font-bold text-sm tracking-tight">+ Add Image</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="flex-[1.5] space-y-6">
                        <div className="p-6 rounded-3xl bg-surface-primary border border-(--border-color) space-y-6">
                            <h3 className="text-text-primary font-bold text-lg uppercase tracking-wider text-sm opacity-80 border-b border-(--border-color) pb-4">
                                Product Details
                            </h3>

                            <Input
                                label="Product Name"
                                placeholder="e.g. Complete Web Dev Bootcamp"
                                value={editingProduct?.name || ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            />

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        label="Price (XAF)"
                                        type="number"
                                        placeholder="0"
                                        value={editingProduct?.price || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="Promo Price (XAF)"
                                        type="number"
                                        placeholder="0"
                                        value={editingProduct?.promotionPrice || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, promotionPrice: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">
                                        Category
                                    </label>
                                    <select
                                        className="w-full h-14 px-4 rounded-xl bg-input-bg border border-input-border text-text-primary outline-none hover:border-text-muted/50 focus:border-[var(--text-primary)] transition-all font-bold text-xs uppercase tracking-widest"
                                        value={editingProduct?.category || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">
                                        Status
                                    </label>
                                    <select
                                        className="w-full h-14 px-4 rounded-xl bg-input-bg border border-input-border text-text-primary outline-none hover:border-text-muted/50 focus:border-[var(--text-primary)] transition-all font-bold text-xs uppercase tracking-widest"
                                        value={editingProduct?.status || 'Draft'}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                        <option value="Unpublished">Unpublished</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full h-40 px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text-primary placeholder-text-muted outline-none hover:border-text-muted/50 focus:border-[var(--text-primary)] focus:bg-surface-primary focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] transition-all font-medium text-sm resize-none"
                                    placeholder="Enter detailed product description..."
                                    value={editingProduct?.description || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {saveError && (
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center mt-4">
                                {saveError}
                            </p>
                        )}

                        <button
                            onClick={saveProductAction}
                            disabled={isSaving || isLoading}
                            className={`w-full h-16 bg-(--text-primary) hover:opacity-90 text-(--bg-primary) font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-3 mt-10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-(--bg-primary) border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Product'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductFormPage;
