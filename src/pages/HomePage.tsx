import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/features/products/ProductCard';
import { useProducts } from '../hooks/useProducts';

const HomePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { products, isLoading, error } = useProducts('Published');

    const categories = [
        'All',
        'Web Development',
        'Artificial Intelligence',
        'Design',
        'Cybersecurity',
        'Data Science',
        'Mobile Development',
        'Cloud',
        'Marketing',
    ];

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());
            const matchCategory = activeCategory === 'All' || p.category === activeCategory;
            return matchSearch && matchCategory;
        });
    }, [search, activeCategory, products]);

    return (
        <div className="pt-28 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-3">
                        {t('home.title')}
                    </h1>
                    <p className="text-text-secondary text-lg max-w-xl">
                        {t('home.description')}
                    </p>
                </motion.div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                        <input
                            type="text"
                            placeholder={t('home.search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-secondary border border-(--border-color) text-text-primary placeholder-text-muted outline-none focus:border-indigo-500/50 transition-all"
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
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'bg-surface-secondary text-text-secondary border border-(--border-color) hover:bg-surface-secondary/80 hover:text-text-primary'
                                }`}
                        >
                            {cat === 'All' ? (i18n.language === 'fr' ? 'Tous' : 'All') : cat}
                        </button>
                    ))}
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                        <div className="w-12 h-12 border-4 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-bold">{t('common.loading') || 'Loading Products...'}</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="p-8 text-center bg-red-500/5 rounded-2xl border border-red-500/20 mb-10">
                        <p className="text-red-500 font-bold mb-2">Failed to load products</p>
                        <p className="text-text-muted text-sm">{error}</p>
                    </div>
                )}

                {/* Product Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((product, idx) => (
                            <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <SlidersHorizontal size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">{t('home.no_products')}</p>
                        <p className="text-sm">{t('home.try_adjusting')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
