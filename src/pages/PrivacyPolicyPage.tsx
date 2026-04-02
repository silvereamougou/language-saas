import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage: React.FC = () => (
    <div className="pt-28 pb-24 px-6 bg-(--bg-primary) text-(--text-primary) transition-colors duration-300">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
            <p className="text-text-muted text-sm mb-10">Last updated: April 1, 2026</p>

            <div className="space-y-8 text-text-secondary leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">1. Introduction</h2>
                    <p>
                        DIGIELERNING Inc. ("we", "our", "us") is committed to protecting your privacy. This
                        Privacy Policy explains how we collect, use, disclose, and safeguard your information
                        when you use our platform, including mobile payment transactions.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">2. Information We Collect</h2>
                    <h3 className="text-lg font-semibold text-text-primary opacity-90 mb-2">Personal Data</h3>
                    <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                        <li>Full name, email address, and phone number</li>
                        <li>Billing and payment information (mobile money details)</li>
                        <li>Mailing address (if applicable)</li>
                        <li>Account credentials</li>
                    </ul>
                    <h3 className="text-lg font-semibold text-text-primary opacity-90 mb-2">Usage Data</h3>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>IP address, browser type, and device information</li>
                        <li>Pages visited and time spent on the platform</li>
                        <li>Course progress and learning activity</li>
                        <li>Transaction history and purchase records</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">3. How We Use Your Information</h2>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>Process purchases and mobile payment transactions</li>
                        <li>Provide and improve our services</li>
                        <li>Send transactional emails and notifications</li>
                        <li>Personalize your learning experience</li>
                        <li>Prevent fraud and ensure platform security</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">4. Mobile Payment Data</h2>
                    <p>
                        When you make a purchase using mobile payment providers (MTN Mobile Money, Orange Money,
                        or other integrated services), your payment data is processed directly by the payment
                        provider. We do not store your full mobile money PIN or account credentials. We only
                        retain transaction reference IDs and amounts for order tracking and accounting purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">5. Data Sharing</h2>
                    <p>We may share your information with:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                        <li><strong className="text-text-primary opacity-90">Payment Providers:</strong> MTN, Orange, and other mobile money operators to process transactions</li>
                        <li><strong className="text-text-primary opacity-90">Service Providers:</strong> Hosting, analytics, and support tools that help us operate</li>
                        <li><strong className="text-text-primary opacity-90">Legal Authorities:</strong> When required by law or to protect our rights</li>
                    </ul>
                    <p className="mt-3">We never sell your personal data to third parties.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">6. Data Security</h2>
                    <p>
                        We implement industry-standard security measures including encryption (TLS/SSL),
                        secure server infrastructure, and regular security audits. However, no method of
                        electronic transmission is 100% secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">7. Your Rights</h2>
                    <p>Under applicable data protection laws, you have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                        <li>Access, correct, or delete your personal data</li>
                        <li>Withdraw consent for data processing</li>
                        <li>Request data portability</li>
                        <li>Object to processing of your data</li>
                    </ul>
                    <p className="mt-3">To exercise these rights, contact us at <span className="text-indigo-400">digiamg2412@gmail.com</span>.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">8. Cookies</h2>
                    <p>
                        We use essential cookies to ensure platform functionality and analytics cookies to
                        improve user experience. You can manage cookie preferences through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Changes will be posted on this
                        page with an updated revision date. Continued use of the platform constitutes
                        acceptance of any modifications.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">10. Contact</h2>
                    <p>
                        For questions about this Privacy Policy, contact us at:<br />
                        <span className="text-indigo-400">digiamg2412@gmail.com</span><br />
                        DIGIELERNING Inc., Douala, Cameroon
                    </p>
                </section>
            </div>
        </motion.div>
    </div>
);

export default PrivacyPolicyPage;
