import React, { useState } from 'react';
import { Modal, Form } from 'antd';
import { User, Mail, ChevronRight, Sparkles, KeyRound, MailCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui';
import { useUser } from '../../../context/UserContext';
import { message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

interface IdentityModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const IdentityModal: React.FC<IdentityModalProps> = ({ visible, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const { requestOtp, verifyOtp } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [showSuccess, setShowSuccess] = useState(false);
    const [savedEmail, setSavedEmail] = useState('');

    const onFinishEmail = async (values: { name: string; email: string }) => {
        setIsSubmitting(true);
        const success = await requestOtp(values.name, values.email);
        setIsSubmitting(false);

        if (success) {
            setSavedEmail(values.email);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setStep('otp');
            }, 2000); // Show "Email Sent" for 2 seconds
        } else {
            message.error('Failed to send OTP. Try again.');
        }
    };

    const onFinishOtp = async (values: { otp: string }) => {
        setIsSubmitting(true);
        const success = await verifyOtp(savedEmail, values.otp);
        setIsSubmitting(false);

        if (success) {
            message.success('Identity verified!');
            onSuccess();
            onClose();
        } else {
            message.error('Invalid or expired OTP.');
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={440}
            className="premium-identity-modal"
            closeIcon={<span className="text-text-muted hover:text-text-primary transition-colors">✕</span>}
            styles={{
                mask: { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.7)' },
                body: { padding: 0, overflow: 'hidden', borderRadius: '32px' },
                content: {
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: 0
                }
            }}
        >
            <div className="p-10 text-center space-y-8 bg-surface-primary relative min-h-[480px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {showSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
                                <MailCheck size={48} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">{t('auth.email_sent')}</h3>
                                <p className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] max-w-[240px] mx-auto leading-relaxed">
                                    {t('auth.otp_code_sent')}
                                    <span className="block text-text-primary mt-1 lowercase font-black text-xs">{savedEmail}</span>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="w-20 h-20 bg-(--icon-color)/10 rounded-3xl flex items-center justify-center mx-auto text-(--icon-color) shadow-xl shadow-indigo-500/10">
                                {step === 'email' ? <Sparkles size={32} strokeWidth={2.5} /> : <KeyRound size={32} strokeWidth={2.5} />}
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">
                                    {step === 'email' ? 'Welcome Back' : 'Verify Identity'}
                                </h2>
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">
                                    {step === 'email' ? 'Identify yourself to start shopping' : `Enter the code we just sent you`}
                                </p>
                            </div>

                            {step === 'email' ? (
                                <Form layout="vertical" onFinish={onFinishEmail} className="space-y-4">
                                    <Form.Item
                                        name="name"
                                        rules={[{ required: true, message: 'Your name is required' }]}
                                        className="!mb-4"
                                    >
                                        <Input
                                            prefixIcon={<User size={18} className="text-text-muted" />}
                                            placeholder="Full Name"
                                            className="bg-surface-secondary!"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
                                        className="!mb-6"
                                    >
                                        <Input
                                            prefixIcon={<Mail size={18} className="text-text-muted" />}
                                            placeholder="Email Address"
                                            className="bg-surface-secondary!"
                                        />
                                    </Form.Item>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full h-16 bg-(--text-primary) text-(--bg-primary) rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:opacity-90 shadow-xl shadow-black/10 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>{t('auth.send_code')} <ChevronRight size={18} /></>}
                                    </button>
                                </Form>
                            ) : (
                                <Form layout="vertical" onFinish={onFinishOtp} className="space-y-4">
                                    <Form.Item
                                        name="otp"
                                        rules={[{ required: true, message: 'Please enter the 6-digit OTP' }]}
                                        className="mb-8!"
                                    >
                                        <Input
                                            prefixIcon={<KeyRound size={18} className="text-text-muted" />}
                                            placeholder="6-Digit OTP"
                                            className="bg-surface-secondary! text-center tracking-[0.5em] font-extrabold text-xl py-6 h-auto rounded-3xl"
                                            maxLength={6}
                                        />
                                    </Form.Item>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full h-16 bg-(--text-primary) text-(--bg-primary) rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:opacity-90 shadow-xl shadow-black/10 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Verify & Continue <ChevronRight size={18} /></>}
                                    </button>
                                    <button type="button" onClick={() => setStep('email')} className="text-[10px] text-text-muted hover:text-text-primary font-black uppercase tracking-widest mt-4">
                                        ← Change Email
                                    </button>
                                </Form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!showSuccess && (
                    <p className="text-[9px] text-text-muted font-medium italic opacity-60 mt-auto">
                        Your session is secure & ends automatically.
                    </p>
                )}
            </div>
        </Modal>
    );
};

export default IdentityModal;
