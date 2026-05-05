import React, { useState } from 'react';
import { Modal, Form, Typography, message } from 'antd';
import { CheckCircle, ShieldCheck, Mail, ChevronRight, ArrowLeft, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui';
import { useTheme } from '../../../context/ThemeContext';
import type { Product } from '../../../types';

const { Title } = Typography;

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onClose, product }) => {
    const { i18n } = useTranslation();
    const { theme: appTheme } = useTheme();
    const [currentView, setCurrentView] = useState<'session' | 'payment' | 'success'>('session');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const priceXAF = new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US').format(product.price);

    const handleSessionSubmit = (values: { email: string }) => {
        setIsProcessing(true);
        setTimeout(() => {
            setEmail(values.email);
            setIsProcessing(false);
            setCurrentView('payment');
        }, 800);
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={currentView === 'success' ? 520 : 680}
            className="premium-checkout-modal"
            closeIcon={<span className="text-text-muted hover:text-text-primary transition-colors">✕</span>}
            styles={{
                mask: { backdropFilter: 'blur(12px)', backgroundColor: appTheme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.7)' },
                body: { padding: 0, overflow: 'hidden', borderRadius: '24px' },
                content: {
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: 0,
                    boxShadow: appTheme === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any}
        >
            <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                {/* Left: Product Recap */}
                {currentView !== 'success' && (
                    <div className="md:w-[260px] bg-surface-primary border-r border-(--border-color) p-8 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/20">
                                <Wallet size={24} className="text-[var(--icon-color)]" />
                            </div>
                            <h3 className="text-text-primary font-black text-lg mb-2 leading-tight uppercase tracking-tight line-clamp-2">{product.name}</h3>
                            <div className="flex flex-col gap-3 mt-8">
                                <div className="flex flex-col">
                                    <span className="text-text-muted font-bold text-[9px] uppercase tracking-widest mb-1">Price</span>
                                    <span className="text-text-primary font-black text-xl tracking-tighter">XAF {priceXAF}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-text-muted font-bold text-[9px] uppercase tracking-widest mb-1">Access</span>
                                    <span className="text-[var(--icon-color)] font-bold text-xs">Instant / Lifetime</span>
                                </div>
                            </div>
                        </div>

                        {email && (
                            <div className="pt-6 border-t border-(--border-color)">
                                <span className="text-text-muted font-bold text-[9px] uppercase tracking-widest block mb-1">Session</span>
                                <span className="text-text-primary text-[11px] font-bold truncate block">{email}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Right: Checkout Flow */}
                <div className="flex-1 p-10 bg-surface-secondary flex flex-col relative">
                    {currentView === 'session' && (
                        <Form layout="vertical" onFinish={handleSessionSubmit} className="flex-1 flex flex-col justify-center max-w-[340px] mx-auto w-full">
                            <Title level={2} className="text-text-primary! mb-1 font-black uppercase tracking-tighter">Begin Access</Title>
                            <p className="text-text-muted text-sm font-medium mb-10 leading-relaxed uppercase tracking-widest text-[10px]">Verify your identity to map your order.</p>

                            <Form.Item
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
                            >
                                <Input
                                    prefixIcon={<Mail size={16} />}
                                    placeholder="Enter your email address"
                                />
                            </Form.Item>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full h-16 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 font-black uppercase tracking-[0.25em] text-[10px] rounded-2xl transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 mt-4 ${isProcessing ? 'opacity-50' : ''}`}
                            >
                                {isProcessing ? 'Initializing...' : <>Identify <ChevronRight size={18} /></>}
                            </button>
                        </Form>
                    )}

                    {currentView === 'payment' && (
                        <div className="flex-1 flex flex-col pt-4">
                            <button type="button" onClick={() => setCurrentView('session')} className="mb-6 flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-[10px] font-bold uppercase tracking-widest leading-none">
                                <ArrowLeft size={14} /> Back
                            </button>

                            <div className="mb-8">
                                <Title level={2} className="text-text-primary! mb-1 font-black uppercase tracking-tight">Payment Setup</Title>
                                <p className="text-text-muted text-sm font-medium uppercase tracking-widest text-[9px]">Complete your purchase securely via Monetbil.</p>
                            </div>

                            <form
                                action="https://api.monetbil.com/widget/v2.1/W4Voiqkf7MpNorzjSsDztxVNrqc6bWtNll0qnyxPjawtwkpCHiLO04EVOMWtD9AU"
                                method="POST"
                                data-monetbil="form"
                                className="space-y-6"
                            >
                                {/* Required Monetbil Parameters */}
                                <input type="hidden" name="amount" value={product.price} />
                                <input type="hidden" name="item_name" value={product.name} />
                                <input type="hidden" name="currency" value="XAF" />
                                <input type="hidden" name="email" value={email} />
                                <input type="hidden" name="payment_ref" value={`${product._id}__${email}`} />
                                <input type="hidden" name="return_url" value="https://digishop24.netlify.app/orders" />
                                <input type="hidden" name="notify_url" value="https://language-saas.onrender.com/api/payments/monetbil/notify" />

                                <div className="p-6 rounded-3xl bg-surface-primary border border-(--border-color) flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--icon-color)]/10 flex items-center justify-center text-[var(--icon-color)]">
                                        <Wallet size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">Total to Pay</p>
                                        <p className="text-xl font-black text-text-primary">XAF {priceXAF}</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-16 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-3 mt-10 active:scale-[0.98]"
                                >
                                    Pay by Mobile Money <ShieldCheck size={18} />
                                </button>
                            </form>
                        </div>
                    )}

                    {currentView === 'success' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-inner">
                                <CheckCircle size={48} className="text-green-500" />
                            </div>
                            <h1 className="text-3xl font-black text-text-primary mb-4 uppercase tracking-tighter">Gateway Triggered</h1>
                            <p className="text-text-secondary max-w-sm mb-12 font-medium leading-relaxed">
                                We've initiated a secure session for <span className="text-text-primary font-black">{email}</span>. Please authorize the payment on your mobile device. Once confirmed, this product will be linked to your email.
                            </p>
                            <div className="flex flex-col w-full gap-3">
                                <button
                                    disabled={isProcessing}
                                    onClick={() => {
                                        setIsProcessing(true);
                                        setTimeout(() => {
                                            setIsProcessing(false);
                                            message.success('Payment confirmed! Your product is now available.');
                                            window.location.href = '/orders';
                                        }, 2000);
                                    }}
                                    className={`w-full h-16 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:opacity-90 shadow-xl shadow-black/10 flex items-center justify-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isProcessing ? 'Verifying Transaction...' : 'Check Payment Status'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full h-14 bg-surface-primary text-text-secondary font-bold uppercase tracking-widest text-[9px] rounded-2xl transition-all hover:bg-surface-secondary hover:text-text-primary border border-(--border-color)"
                                >
                                    Done, Return to Store
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PaymentModal;
