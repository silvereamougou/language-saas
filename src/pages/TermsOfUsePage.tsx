import React from 'react';
import { motion } from 'framer-motion';

const TermsOfUsePage: React.FC = () => (
    <div className="pt-28 pb-24 px-6 bg-(--bg-primary) text-(--text-primary) transition-colors duration-300">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Terms of Use</h1>
            <p className="text-text-muted text-sm mb-10">Last updated: April 1, 2026</p>

            <div className="space-y-8 text-text-secondary leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using DIGIELERNING, you accept and agree to be bound by these Terms of Use.
                        If you do not agree, please do not use the platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">2. User Account</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials.
                        You agree to notify us immediately of any unauthorized use of your account. DIGIELERNING
                        is not liable for any loss arising from unauthorized use.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">3. Products & Purchases</h2>
                    <p>
                        All products sold on DIGIELERNING are digital goods. Prices are displayed in XAF (via USD conversion) and may
                        be subject to change. Once purchased, digital products grant a non-transferable,
                        non-exclusive license for personal or organizational use as described.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">4. Payment Methods</h2>
                    <p>
                        We accept mobile payments including MTN Mobile Money, Orange Money, and other integrated
                        payment providers. All transactions are securely processed through our payment partners.
                        By making a purchase, you agree to the payment provider's terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">5. Refund Policy</h2>
                    <p>
                        We offer a 30-day money-back guarantee on all courses. If you're unsatisfied, contact
                        support within 30 days of purchase for a full refund. Custom enterprise agreements follow
                        separate refund terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">6. Prohibited Conduct</h2>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>Sharing purchased content with unauthorized third parties</li>
                        <li>Reverse engineering or scraping platform content</li>
                        <li>Using the platform for unlawful activities</li>
                        <li>Impersonating others or providing false information</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">7. Termination</h2>
                    <p>
                        DIGIELERNING reserves the right to suspend or terminate accounts that violate these terms
                        without prior notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">8. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of the Republic of Cameroon.
                    </p>
                </section>
            </div>
        </motion.div>
    </div>
);

export default TermsOfUsePage;
