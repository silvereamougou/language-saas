import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Target, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '../components/ui';

const AboutPage: React.FC = () => {
    const { t } = useTranslation();

    const stats = [
        { icon: <Users />, value: '10,000+', label: t('about.stats.learners') },
        { icon: <Award />, value: '500+', label: t('about.stats.courses') },
        { icon: <Target />, value: '98%', label: t('about.stats.satisfaction') },
        { icon: <Globe />, value: '45+', label: t('about.stats.countries') },
    ];

    const team = [
        { name: 'Malik Touré', role: 'CEO & Founder', image: '/assets/team/ceo.png' },
        { name: 'Amina Diallo', role: 'CTO', image: '/assets/team/cto.png' },
        { name: 'Moussa Sarr', role: 'Head of Product', image: '/assets/team/product.png' },
        { name: 'Fatou Camara', role: 'Head of Marketing', image: '/assets/team/marketing.png' },
    ];

    return (
        <div className="pt-28 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
                            {t('about.mission')}{' '}
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-500">
                                {t('about.democratize')}
                            </span>
                        </h1>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            {t('about.hero_desc')}
                        </p>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center p-6 rounded-3xl bg-(--surface-primary) border border-(--border-color)"
                        >
                            <div className="text-indigo-400 flex justify-center mb-3">{s.icon}</div>
                            <p className="text-3xl font-bold text-text-primary mb-1">{s.value}</p>
                            <p className="text-sm text-text-muted">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Story */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <h2 className="text-sm font-bold text-indigo-500 tracking-widest uppercase mb-4">{t('about.story.tag')}</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('about.story.title')}</h3>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            {t('about.story.p1')}
                        </p>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            {t('about.story.p2')}
                        </p>
                        <p className="text-text-secondary leading-relaxed">
                            {t('about.story.p3')}
                        </p>
                    </div>
                    <div className="rounded-3xl overflow-hidden border border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                            alt="Team collaboration"
                            className="w-full aspect-4/3 object-cover"
                        />
                    </div>
                </div>

                {/* Our Team */}
                <SectionHeading
                    tag={t('about.team.tag')}
                    tagColor="text-purple-500"
                    title={t('about.team.title')}
                    description={t('about.team.desc')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center group"
                        >
                            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-(--border-color) group-hover:border-indigo-500/50 transition-colors mb-4">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-text-primary font-bold text-lg">{member.name}</h4>
                            <p className="text-text-muted text-sm">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
