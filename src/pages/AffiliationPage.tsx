import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, SectionHeading, Input, Textarea } from '../components/ui';

const AffiliationPage: React.FC = () => {
    const { t } = useTranslation();

    const perks = [
        { icon: <TrendingUp className="text-green-400" />, title: t('affiliation.perks.revenue.title'), description: t('affiliation.perks.revenue.desc') },
        { icon: <Handshake className="text-indigo-400" />, title: t('affiliation.perks.reach.title'), description: t('affiliation.perks.reach.desc') },
        { icon: <ShieldCheck className="text-purple-400" />, title: t('affiliation.perks.security.title'), description: t('affiliation.perks.security.desc') },
    ];

    return (
        <div className="pt-28 pb-24 px-6 bg-(--bg-primary) text-(--text-primary) transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
                            {t('affiliation.title')}{' '}
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-500">
                                DIGIELERNING
                            </span>
                        </h1>
                        <p className="text-text-secondary text-lg leading-relaxed mb-8">
                            {t('affiliation.hero_desc')}
                        </p>
                        <Button size="lg">
                            {t('affiliation.cta')} <ArrowRight size={20} />
                        </Button>
                    </motion.div>
                </div>

                {/* Perks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {perks.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-(--bg-secondary) border border-(--border-color) hover:border-indigo-500/30 transition-all"
                        >
                            <div className="w-12 h-12 bg-(--surface-primary) rounded-2xl flex items-center justify-center mb-6">
                                {p.icon}
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3">{p.title}</h3>
                            <p className="text-text-muted text-sm leading-relaxed">{p.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Form */}
                <div className="max-w-3xl mx-auto">
                    <div className="p-8 md:p-12 rounded-3xl bg-(--bg-secondary) border border-(--border-color) relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Handshake size={120} className="text-text-primary" />
                        </div>

                        <SectionHeading
                            tag="Application"
                            tagColor="text-indigo-500"
                            title={t('affiliation.form.title')}
                            description={t('affiliation.form.desc')}
                        />

                        <form
                            name="affiliation"
                            method="POST"
                            data-netlify="true"
                            className="space-y-6 mt-8"
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
                                        alert("Application submitted successfully!");
                                        myForm.reset();
                                    })
                                    .catch((error) => alert(error));
                            }}
                        >
                            <input type="hidden" name="form-name" value="affiliation" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label={t('affiliation.form.fields.name')} name="name" placeholder="John Doe" required />
                                <Input label={t('affiliation.form.fields.email')} name="email" placeholder="john@example.com" type="email" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label={t('affiliation.form.fields.company')} name="company" placeholder="My Digital Brand" required />
                                <Input label={t('affiliation.form.fields.website')} name="website" placeholder="https://..." required />
                            </div>
                            <Input label={t('affiliation.form.fields.product_type')} name="product_type" placeholder="Software, E-book, Online Course..." required />
                            <Textarea label={t('affiliation.form.fields.description')} name="description" placeholder={t('affiliation.form.fields.description')} rows={4} required />
                            <Button type="submit" className="w-full h-14 text-lg">
                                {t('affiliation.form.fields.submit')}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliationPage;
