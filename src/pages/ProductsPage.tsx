import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionHeading, Skeleton } from '../components/ui';
import ProductCard from '../components/features/products/ProductCard';
import { useProducts } from '../hooks/useProducts';

const categories = ['All', 'Web Development', 'Artificial Intelligence', 'Design', 'Cybersecurity', 'Data Science', 'Mobile Development', 'Cloud', 'Marketing'];

const ProductsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { products, isLoading, error } = useProducts('Published');

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());
            const matchCategory = activeCategory === 'All' || p.category === activeCategory;
            return matchSearch && matchCategory;
        });
    }, [search, activeCategory, products]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-4 p-5 rounded-3xl bg-surface-secondary border border-(--border-color) h-full animate-pulse">
                            <Skeleton variant="rounded" height={200} animation="wave" />
                            <div className="space-y-3 px-2">
                                <Skeleton variant="rectangular" height={24} width="70%" animation="wave" className="rounded-md" />
                                <Skeleton variant="rectangular" height={16} width="100%" animation="wave" className="rounded-md" />
                                <div className="flex items-center justify-between pt-4">
                                    <Skeleton variant="rectangular" height={20} width="40%" animation="wave" className="rounded-md" />
                                    <Skeleton variant="rounded" height={40} width={100} animation="wave" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-20 bg-red-500/5 rounded-3xl border border-red-500/20">
                    <p className="text-red-500 font-bold mb-2">Error Loading Catalog</p>
                    <p className="text-text-muted text-sm">{error}</p>
                </div>
            );
        }

        if (filtered.length > 0) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((product, idx) => (
                        <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center py-20 text-text-secondary">
                <SlidersHorizontal size={48} className="mx-auto mb-4 opacity-50 text-icon-color" />
                <p className="text-lg font-bold">{t('home.no_products')}</p>
                <p className="text-sm opacity-60">{t('home.try_adjusting')}</p>
            </div>
        );
    };

    return (
        <div className="pt-28 pb-24 px-6 bg-(--bg-primary) text-(--text-primary) transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    tag="Catalog"
                    tagColor="text-purple-500"
                    title={t('home.title')}
                    description={t('home.description')}
                />

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative grow group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-indigo-500 transition-colors duration-300" size={20} />
                        <input
                            type="text"
                            placeholder={t('home.search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-secondary border border-(--border-color) text-text-primary placeholder-text-muted outline-none hover:border-indigo-500/50 focus:border-indigo-500 focus:bg-surface-primary focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] transition-all font-bold"
                        />
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${activeCategory === cat
                                ? 'bg-(--text-primary) text-(--bg-primary) shadow-lg shadow-black/10'
                                : 'bg-surface-secondary text-text-secondary border border-(--border-color) hover:bg-surface-secondary/80 hover:text-text-primary'
                                }`}
                        >
                            {cat === 'All' ? (i18n.language === 'fr' ? 'Tous' : 'All') : cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid / Loading / Empty */}
                {renderContent()}
            </div>
        </div>
    );
};

export default ProductsPage;
