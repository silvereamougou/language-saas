import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Badge, message } from 'antd';
import { useCart } from '../../../context/CartContext';
import { useUser } from '../../../context/UserContext';
import StatusBadge from '../../ui/StatusBadge';
import IdentityModal from '../checkout/IdentityModal';

import type { Product } from '../../../types';

interface ProductCardProps {
    product: Product;
    index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
    const { t, i18n } = useTranslation();
    const { addToCart } = useCart();
    const { user } = useUser();
    const [isIdentityModalVisible, setIsIdentityModalVisible] = useState(false);

    const handlePlusClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsIdentityModalVisible(true);
        } else {
            addToCart(product);
            message.success(`${product.name} added to cart!`);
        }
    };

    const handleIdentitySuccess = () => {
        addToCart(product);
        message.success(`${product.name} added to cart!`);
    };

    // Original course formatting
    const formattedPrice = new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US').format(product.price);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
            >
                <Badge.Ribbon
                    text="REQUEST NOW"
                    color="var(--icon-color)"
                    placement="start"
                    className="[&_.ant-ribbon-text]:text-white [&_.ant-ribbon-text]:font-black [&_.ant-ribbon-text]:text-[10px] [&_.ant-ribbon-text]:uppercase [&_.ant-ribbon-text]:tracking-widest z-10"
                >
                    <Link
                        to={`/products/${product._id}`}
                        className="block rounded-3xl bg-surface-secondary border border-(--border-color) overflow-hidden hover:border-(--icon-color) hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 group/card"
                    >
                        {/* Image Section */}
                        <div className="relative aspect-4/3 overflow-hidden bg-(--surface-primary)">
                            <img
                                src={product.image || product.thumbnail}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100 mix-blend-multiply dark:mix-blend-normal"
                            />

                            {/* Interactive Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-(--bg-primary)/90 via-(--bg-primary)/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                                <span className="text-(--text-primary) font-black text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <ShoppingCart size={18} className="text-(--icon-color)" /> {t('product.view_details')}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <StatusBadge
                                    status="published"
                                    label={product.category}
                                    size="xs"
                                    variant="status"
                                    className="!bg-(--icon-color) !text-(--bg-primary) border-none px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest"
                                />
                                <div className="flex items-center gap-1 text-(--icon-color)">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-sm font-black text-text-primary">{product.rating}</span>
                                    <span className="text-xs text-text-muted">({product.reviews})</span>
                                </div>
                            </div>

                            <h4 className="text-text-primary font-black text-xl mb-2 group-hover:text-(--icon-color) transition-colors line-clamp-1 uppercase tracking-tight">
                                {product.name}
                            </h4>

                            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-6 h-10">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-(--border-color)">
                                <div>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1 opacity-60">Price</p>
                                    <span className="text-2xl font-black text-text-primary tracking-tighter">
                                        XAF {formattedPrice}
                                    </span>
                                </div>
                                <button
                                    onClick={handlePlusClick}
                                    className="w-10 h-10 rounded-full bg-surface-secondary border border-(--border-color) flex items-center justify-center text-text-muted hover:bg-(--icon-color) hover:text-(--bg-primary) transition-all active:scale-95"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </Link>
                </Badge.Ribbon>
            </motion.div>

            <IdentityModal
                visible={isIdentityModalVisible}
                onClose={() => setIsIdentityModalVisible(false)}
                onSuccess={handleIdentitySuccess}
            />
        </>
    );
};

export default ProductCard;
