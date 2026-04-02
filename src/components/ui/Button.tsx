import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}) => {
    return (
        <button
            className={cn(
                'font-bold rounded-2xl transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer',
                {
                    'bg-(--text-primary) text-(--bg-primary) hover:opacity-90 shadow-xl shadow-black/10': variant === 'primary',
                    'bg-surface-secondary border border-(--border-color) text-text-primary hover:bg-surface-secondary/80': variant === 'secondary',
                    'border border-(--border-color) text-text-primary hover:bg-surface-secondary': variant === 'outline',
                    'text-text-secondary hover:text-text-primary hover:bg-surface-secondary': variant === 'ghost',
                },
                {
                    'px-4 py-2 text-sm': size === 'sm',
                    'px-6 py-3 text-sm': size === 'md',
                    'px-8 py-4 text-base': size === 'lg',
                },
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
