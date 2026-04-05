import React from 'react';
import StatusBadge from '../../ui/StatusBadge';
import { useTranslation } from 'react-i18next';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '../../ui';
import { useApi } from '../../../context/ApiContext';
import { message } from 'antd';

import type { Order } from '../../../types';

interface OrderItemProps {
    order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
    const { i18n } = useTranslation();
    const { generateDownloadToken } = useApi();
    const [isDownloading, setIsDownloading] = React.useState(false);

    const price = order.price || 0;
    const qty = order.quantity || 1;
    const formattedTotal = new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US').format(price * qty);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const { token } = await generateDownloadToken(order.productId as string);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            window.location.href = `${API_URL}/downloads/${token}`;
        } catch (err: any) {
            message.error(err.message || 'Failed to initialize secure download.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-7 rounded-3xl bg-[var(--surface-secondary)] border border-(--border-color) hover:border-[var(--icon-color)] transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--icon-color)] opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Image */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[var(--surface-primary)] border border-(--border-color) shrink-0 shadow-2xl">
                <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Product Info */}
            <div className="grow min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-[var(--text-primary)] text-lg font-black truncate uppercase tracking-tight">{order.productName}</h4>
                    <StatusBadge status={order.status} size="xs" variant="status" className="shrink-0" />
                </div>
                <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest leading-none mb-4">
                    Order #{order.id} · {order.date}
                </p>

                <div className="flex items-center gap-4">
                    {order.customerName && (
                        <div className="flex items-center gap-2 bg-[var(--surface-primary)] px-3 py-1.5 rounded-xl border border-(--border-color) transition-colors group-hover:border-[var(--icon-color)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--icon-color)]" />
                            <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider">{order.customerName}</span>
                        </div>
                    )}

                    <p className="text-(--text-secondary) text-[10px] font-bold uppercase tracking-widest opacity-60">
                        Qty: {qty} × XAF {new Intl.NumberFormat().format(price)}
                    </p>
                </div>
            </div>

            {/* Actions & Total */}
            <div className="flex flex-col items-end gap-4 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-none border-(--border-color)">
                <div className="flex flex-col items-end">
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-1 opacity-60">Total Paid</p>
                    <div className="text-[var(--text-primary)] font-black text-2xl tracking-tighter group-hover:text-[var(--icon-color)] transition-colors">
                        XAF {formattedTotal}
                    </div>
                </div>

                {order.status === 'success' && (
                    <Button
                        size="sm"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="h-10 px-5 bg-[var(--text-primary)] hover:opacity-90 text-[var(--bg-primary)] font-black uppercase tracking-widest text-[9px] rounded-xl shadow-lg shadow-black/10 active:scale-95 transition-all"
                    >
                        {isDownloading ? (
                            <><Loader2 size={14} className="mr-2 animate-spin" /> Preparing...</>
                        ) : (
                            <><Download size={14} className="mr-2" /> Download Asset</>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OrderItem;
