import React from 'react';
import { Select as AntSelect, ConfigProvider, theme } from 'antd';
import type { SelectProps as AntSelectProps } from 'antd';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

interface SelectOption {
    label: string | React.ReactNode;
    value: string | number;
}

interface SelectProps extends Omit<AntSelectProps, 'options'> {
    label?: string;
    error?: string;
    options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
    const { theme: appTheme } = useTheme();

    return (
        <ConfigProvider
            theme={{
                algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#6366f1',
                    borderRadius: 16,
                    colorBgContainer: appTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                    colorBorder: appTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                    colorBgElevated: appTheme === 'dark' ? '#111111' : '#ffffff',
                    colorText: appTheme === 'dark' ? '#ffffff' : '#111827',
                },
            }}
        >
            <div className="flex flex-col gap-2 w-full group">
                {label && (
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">
                        {label}
                    </label>
                )}

                <AntSelect
                    options={options}
                    suffixIcon={<ChevronDown className="text-text-muted group-hover:text-text-primary transition-colors" size={16} />}
                    className={cn(
                        'premium-select-ui h-16! rounded-2xl! w-full',
                        error && 'border-red-500/50!',
                        className
                    )}
                    dropdownStyle={{
                        borderRadius: '16px',
                        padding: '6px',
                        backgroundColor: appTheme === 'dark' ? '#111111' : '#ffffff',
                        border: appTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                    {...props}
                />

                {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest px-1 mt-1">{error}</p>}
            </div>
        </ConfigProvider>
    );
};

export default Select;
