import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    // Social links fixed with real buttons/links
    const socialLinks = [
        { Icon: Globe, href: 'https://digielearning.com', label: 'Website' },
        { Icon: Mail, href: 'mailto:digiamg2412@gmail.com', label: 'Email' },
        { Icon: MessageCircle, href: 'https://wa.me/237621166263', label: 'WhatsApp' },
    ];

    return (
        <footer className="py-20 px-6 border-t border-(--border-color) bg-(--surface-primary) transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand */}
                <div className="lg:col-span-1">
                    <Link to="/" className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-(--icon-color) rounded-xl flex items-center justify-center font-bold text-(--bg-primary)">
                            D
                        </div>
                        <span className="text-xl font-bold text-text-primary transition-colors">DIGIELERNING</span>
                    </Link>
                    <p className="text-(--text-secondary) max-w-sm mb-8 leading-relaxed text-sm">
                        {t('footer.description')}
                    </p>
                    <div className="flex gap-3">
                        {socialLinks.map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-(--border-color) flex items-center justify-center text-(--icon-color) hover:text-text-primary hover:border-(--text-primary) transition-all"
                                aria-label={label}
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Platform */}
                <div>
                    <h5 className="text-text-primary font-bold mb-6 uppercase tracking-wider text-xs transition-colors">
                        {t('nav.products')}
                    </h5>
                    <ul className="space-y-3 text-(--text-secondary) text-sm">
                        <li>
                            <Link to="/products" className="hover:text-text-primary transition-colors">
                                {t('nav.products')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-text-primary transition-colors">
                                {t('nav.about')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/affiliation" className="hover:text-text-primary transition-colors">
                                {t('nav.affiliation')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-text-primary transition-colors">
                                {t('nav.contact')}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h5 className="text-text-primary font-bold mb-6 uppercase tracking-wider text-xs transition-colors">
                        Legal
                    </h5>
                    <ul className="space-y-3 text-(--text-secondary) text-sm">
                        <li>
                            <Link to="/legal-notice" className="hover:text-text-primary transition-colors">
                                {t('footer.legal')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms-of-use" className="hover:text-text-primary transition-colors">
                                {t('footer.terms')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/privacy-policy" className="hover:text-text-primary transition-colors">
                                {t('footer.privacy')}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h5 className="text-text-primary font-bold mb-6 uppercase tracking-wider text-xs transition-colors">
                        Support
                    </h5>
                    <ul className="space-y-3 text-(--text-secondary) text-sm">
                        <li>
                            <Link to="/orders" className="hover:text-text-primary transition-colors">
                                {t('nav.my_orders')}
                            </Link>
                        </li>
                        <li>
                            <button className="hover:text-text-primary transition-colors cursor-pointer text-left focus:outline-none">Help Center</button>
                        </li>
                        <li>
                            <button className="hover:text-text-primary transition-colors cursor-pointer text-left focus:outline-none">FAQ</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-(--border-color) flex flex-col md:flex-row items-center justify-between gap-4 text-(--text-secondary) text-xs text-center md:text-left transition-colors">
                <p>{t('footer.rights')}</p>
                <div className="flex gap-6">
                    <Link to="/terms-of-use" className="hover:text-text-primary transition-colors">
                        {t('footer.terms')}
                    </Link>
                    <Link to="/privacy-policy" className="hover:text-text-primary transition-colors">
                        {t('footer.privacy')}
                    </Link>
                    <Link to="/legal-notice" className="hover:text-text-primary transition-colors">
                        {t('footer.legal')}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
