import React, { useState } from 'react';
import { Modal, Form } from 'antd';
import { User, Mail, ChevronRight, Sparkles, KeyRound } from 'lucide-react';
import { Input } from '../../ui';
import { useUser } from '../../../context/UserContext';
import { message } from 'antd';

interface IdentityModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const IdentityModal: React.FC<IdentityModalProps> = ({ visible, onClose, onSuccess }) => {
    const { requestOtp, verifyOtp } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [savedEmail, setSavedEmail] = useState('');

    const onFinishEmail = async (values: { name: string; email: string }) => {
        setIsSubmitting(true);
        const success = await requestOtp(values.name, values.email);
        setIsSubmitting(false);

        if (success) {
            setSavedEmail(values.email);
            setStep('otp');
            message.success('OTP sent! (check dev console for pseudo OTP)');
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
            } as any}
        >
            <div className="p-10 text-center space-y-8 bg-surface-primary">
                <div className="w-20 h-20 bg-(--icon-color)/10 rounded-3xl flex items-center justify-center mx-auto text-(--icon-color) shadow-xl shadow-indigo-500/10">
                    <Sparkles size={32} strokeWidth={2.5} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">
                        {step === 'email' ? 'Create Session' : 'Verify Identity'}
                    </h2>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">
                        {step === 'email' ? 'Identify yourself to start shopping' : `Enter the code sent to ${savedEmail}`}
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
                            {isSubmitting ? 'Syncing...' : <>Send Secure Code <ChevronRight size={18} /></>}
                        </button>
                    </Form>
                ) : (
                    <Form layout="vertical" onFinish={onFinishOtp} className="space-y-4">
                        <Form.Item
                            name="otp"
                            rules={[{ required: true, message: 'Please enter the 6-digit OTP' }]}
                            className="mb-6!"
                        >
                            <Input
                                prefixIcon={<KeyRound size={18} className="text-text-muted" />}
                                placeholder="6-Digit OTP"
                                className="bg-surface-secondary! text-center tracking-[0.5em] font-black text-lg"
                                maxLength={6}
                            />
                        </Form.Item>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full h-16 bg-(--text-primary) text-(--bg-primary) rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:opacity-90 shadow-xl shadow-black/10 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            {isSubmitting ? 'Verifying...' : <>Enter Store <ChevronRight size={18} /></>}
                        </button>
                        <button type="button" onClick={() => setStep('email')} className="text-xs text-text-muted hover:text-text-primary font-bold mt-2">
                            ← Change Email
                        </button>
                    </Form>
                )}

                <p className="text-[9px] text-text-muted font-medium italic opacity-60">
                    Your details are used only to automate your secure checkout.
                </p>
            </div>
        </Modal>
    );
};

export default IdentityModal;
