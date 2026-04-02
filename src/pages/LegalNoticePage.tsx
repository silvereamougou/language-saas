import React from 'react';
import { motion } from 'framer-motion';

const LegalNoticePage: React.FC = () => (
    <div className="pt-28 pb-24 px-6 bg-(--bg-primary) text-(--text-primary) transition-colors duration-300">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-8">Legal Notice</h1>
            <div className="prose prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">1. Publisher Information</h2>
                    <p>
                        <strong className="text-text-primary opacity-80">Company Name:</strong> DIGIELERNING Inc.<br />
                        <strong className="text-text-primary opacity-80">Registered Address:</strong> Douala, Cameroon<br />
                        <strong className="text-text-primary opacity-80">Email:</strong> digiamg2412@gmail.com<br />
                        <strong className="text-text-primary opacity-80">Phone:</strong> +237 621 166 263
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">2. Hosting</h2>
                    <p>
                        The DIGIELERNING platform is hosted by reputable cloud service providers to ensure
                        reliability, speed, and security of data across all regions.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">3. Intellectual Property</h2>
                    <p>
                        All content available on DIGIELERNING, including but not limited to texts, graphics, images,
                        videos, logos, and software, is the property of DIGIELERNING Inc. or its content partners.
                        Any unauthorized reproduction, distribution, or modification is strictly prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">4. Limitation of Liability</h2>
                    <p>
                        DIGIELERNING strives to provide accurate and up-to-date information but cannot guarantee the
                        completeness or accuracy of all content. DIGIELERNING shall not be held liable for any direct or
                        indirect damages resulting from use of the platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">5. Applicable Law</h2>
                    <p>
                        These legal terms are governed by the laws of the Republic of Cameroon. In case of dispute,
                        competent courts of Douala shall have exclusive jurisdiction.
                    </p>
                </section>
            </div>
        </motion.div>
    </div>
);

export default LegalNoticePage;
