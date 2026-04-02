import React from 'react';
import { motion } from 'framer-motion';

const PageLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#050505]">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="w-16 h-16 rounded-full border-2 border-indigo-500/10 border-t-indigo-500"
                />

                {/* Inner Pulse */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-indigo-500/20 blur-xl"
                />

                {/* Logo or Center Dot */}
                <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
            </div>
        </div>
    );
};

export default PageLoader;
