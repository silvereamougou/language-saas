import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
    className?: string;
    children: React.ReactNode;
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({ className, children, hover = true }) => {
    return (
        <div
            className={cn(
                'p-6 rounded-3xl bg-[#0d0d0d] border border-white/5 transition-all duration-300',
                hover && 'hover:border-indigo-500/30 hover:-translate-y-1',
                className
            )}
        >
            {children}
        </div>
    );
};

export default Card;
