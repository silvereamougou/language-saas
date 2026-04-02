import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionHeading, Button, Input, Textarea } from '../components/ui';

const ContactPage: React.FC = () => {
    const { t } = useTranslation();

    const info = [
        { icon: <Mail className="text-indigo-400" />, label: t('contact.form.fields.email'), value: 'digiamg2412@gmail.com', href: 'mailto:digiamg2412@gmail.com' },
        { icon: <Globe className="text-blue-400" />, label: 'Website', value: 'digielearning.com', href: 'https://digielearning.com' },
        { icon: <Phone className="text-green-400" />, label: 'Phone', value: '+237 621 166 263', href: 'tel:+237621166263' },
        { icon: <MessageCircle className="text-green-500" />, label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/237621166263' },
        { icon: <MapPin className="text-purple-400" />, label: 'Address', value: 'Douala, Cameroon', href: '#' },
    ];

    return (
        <div className="pt-28 pb-24 px-6 bg-(--bg-primary) text-(--text-primary) transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    tag={t('contact.tag')}
                    tagColor="text-indigo-500"
                    title={t('contact.title')}
                    description={t('contact.desc')}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
                    {/* Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {info.map((item, i) => (
                            <motion.a
                                key={i}
                                href={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4 p-5 rounded-2xl bg-(--bg-secondary) border border-(--border-color) hover:border-indigo-500/30 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-(--surface-primary) rounded-xl flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">{item.label}</p>
                                    <p className="text-text-primary font-medium">{item.value}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 p-8 md:p-10 rounded-3xl bg-(--bg-secondary) border border-(--border-color)"
                    >
                        <h3 className="text-2xl font-bold text-text-primary mb-2">{t('contact.form.title')}</h3>
                        <p className="text-text-muted mb-8">{t('contact.form.desc')}</p>

                        <form
                            name="contact"
                            method="POST"
                            data-netlify="true"
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const myForm = e.currentTarget;
                                const formData = new FormData(myForm);
                                fetch("/", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                    //@ts-expect-error URLSearchParams correctly converts to string for body
                                    body: new URLSearchParams(formData).toString(),
                                })
                                    .then(() => {
                                        alert("Message sent successfully!");
                                        myForm.reset();
                                    })
                                    .catch((error) => alert(error));
                            }}
                        >
                            <input type="hidden" name="form-name" value="contact" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label={t('contact.form.fields.first_name')} name="first_name" placeholder="John" required />
                                <Input label={t('contact.form.fields.last_name')} name="last_name" placeholder="Doe" required />
                            </div>
                            <Input label={t('contact.form.fields.email')} name="email" placeholder="john@example.com" type="email" required />
                            <Input label={t('contact.form.fields.subject')} name="subject" placeholder={t('contact.form.fields.subject')} required />
                            <Textarea label={t('contact.form.fields.message')} name="message" placeholder={t('contact.form.fields.message')} rows={5} required />
                            <Button type="submit" className="w-full h-14 text-lg">
                                {t('contact.form.fields.submit')} <Send size={18} />
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
