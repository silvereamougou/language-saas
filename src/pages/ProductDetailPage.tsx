import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, CheckCircle, Clock, Users, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Badge } from '../components/ui';
import PaymentModal from '../components/features/checkout/PaymentModal';
import { useProduct } from '../hooks/useProducts';

const ProductDetailPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [isPaymentVisible, setIsPaymentVisible] = useState(false);
    const { product, isLoading, error } = useProduct(id);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const mainImage = selectedImage || (product?.thumbnail || product?.image || '');

    if (isLoading) {
        return (
            <div className="pt-36 pb-24 px-6 text-center flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin mb-6" />
                <h2 className="text-xl font-bold text-text-primary mb-2">Loading Product Details...</h2>
                <p className="text-text-secondary">Connecting to secure server</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="pt-36 pb-24 px-6 text-center max-w-md mx-auto">
                <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 mb-8">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Product Not Found</h2>
                    <p className="text-text-muted text-sm">{error || "The product you're looking for doesn't exist or has been removed."}</p>
                </div>
                <Link to="/products">
                    <Button variant="outline" className="w-full">
                        <ArrowLeft size={18} className="mr-2" /> Back to Catalog
                    </Button>
                </Link>
            </div>
        );
    }

    const galleries = product.gallery?.length ? product.gallery : (Array.isArray(product.image) ? product.image : [product.image || product.thumbnail || '']);

    return (
        <div className="pt-28 pb-24 px-6 bg-(--bg-primary) text-(--text-primary) transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
                    <Link to="/products" className="hover:text-text-primary transition-colors">
                        {t('nav.products')}
                    </Link>
                    <span>/</span>
                    <span className="text-text-secondary">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Images & Long Description */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        {/* Main Image Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group"
                        >
                            <div className="aspect-16/10 rounded-3xl overflow-hidden border border-(--border-color) bg-(--surface-primary)">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={mainImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        src={mainImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Image Navigation Arrows (Optional, but let's do thumbnails first) */}
                        </motion.div>

                        {/* Thumbnails Gallery */}
                        {galleries.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                {galleries.map((img, idx) => (
                                    <button
                                        key={`thumb-${img}-${idx}`}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-[var(--text-primary)] scale-105 shadow-lg shadow-black/10' : 'border-(--border-color) hover:border-[var(--text-primary)]/30'
                                            }`}
                                    >
                                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Description Section (Placed specifically under the image as requested) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-(--surface-primary) border border-(--border-color)"
                        >
                            <h2 className="text-2xl font-bold text-text-primary mb-6 uppercase tracking-wider text-sm opacity-60">
                                {t('product.description')}
                            </h2>
                            <div className="text-text-secondary leading-relaxed text-lg whitespace-pre-wrap">
                                {product.description}
                                <br /><br />
                                This section can contain more elaborate details, curriculum overview, or tool documentation depending on the product type.
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Pricing & Quick Info (Sticky) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 flex flex-col gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-8 rounded-3xl bg-(--bg-secondary) border border-(--border-color) shadow-2xl"
                            >
                                <Badge className="mb-4">{product.category}</Badge>
                                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={`star-${product.id || product.name}-${i}`} size={18} fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'} className={i >= Math.floor(product.rating || 0) ? 'text-gray-600' : ''} />
                                        ))}
                                    </div>
                                    <span className="text-text-primary font-bold">{product.rating}</span>
                                    <span className="text-text-muted">({product.reviews} reviews)</span>
                                </div>

                                {/* Quick Stats Section */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {[
                                        { icon: Clock, label: 'Duration', value: '24 hrs', id: 'duration' },
                                        { icon: Users, label: 'Students', value: `${product.reviews}+`, id: 'students' },
                                        { icon: BookOpen, label: 'Modules', value: '12', id: 'modules' },
                                    ].map((m) => (
                                        <div key={m.id} className="p-3 rounded-2xl bg-(--surface-primary) border border-(--border-color) text-center flex flex-col items-center">
                                            <m.icon size={18} className="text-[var(--icon-color)] mb-2" />
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-black mb-1">{m.label}</p>
                                            <p className="text-text-primary font-bold text-xs">{m.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Section */}
                                <div className="p-6 rounded-2xl bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/20 mb-8">
                                    <div className="flex justify-between items-baseline mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-[var(--icon-color)] font-bold uppercase tracking-widest">Price</span>
                                            <span className="text-4xl font-black text-text-primary">XAF {new Intl.NumberFormat().format(product.price)}</span>
                                        </div>
                                        <span className="text-xs text-[var(--icon-color)] font-medium">Life Access</span>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full h-14 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-xl shadow-black/10 text-lg font-black"
                                        onClick={() => setIsPaymentVisible(true)}
                                    >
                                        <ShoppingCart size={22} className="mr-2" /> {t('product.buy_now')}
                                    </Button>
                                </div>

                                {/* Guarantees */}
                                <div className="flex flex-col gap-4">
                                    {[
                                        { key: 'money_back', text: t('product.guarantee.money_back') },
                                        { key: 'lifetime', text: t('product.guarantee.lifetime') },
                                        { key: 'secure', text: t('product.guarantee.secure') }
                                    ].map((g) => (
                                        <div key={g.key} className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                            <CheckCircle size={18} className="text-[var(--icon-color)] shrink-0" /> {g.text}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {product && (
                <PaymentModal
                    visible={isPaymentVisible}
                    onClose={() => setIsPaymentVisible(false)}
                    product={product}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
