import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    prefixIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, prefixIcon, className, id, ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full group">
            {label && (
                <label htmlFor={id} className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {prefixIcon && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-indigo-500 transition-transform group-focus-within:scale-110">
                        {prefixIcon}
                    </div>
                )}
                <input
                    id={id}
                    className={cn(
                        'w-full h-16 rounded-2xl bg-input-bg border border-input-border text-text-primary placeholder-text-muted outline-none transition-all duration-300 font-bold',
                        'hover:bg-surface-secondary hover:border-text-muted/30',
                        'focus:bg-surface-primary focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10',
                        prefixIcon ? 'pl-16 pr-6' : 'px-6',
                        error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest px-1 mt-1">{error}</p>}
        </div>
    );
};

export default Input;
