import React, { useState } from 'react';
import { Select, ConfigProvider, theme } from 'antd';
import { cn } from '../../lib/utils';
import { ChevronDown, PhoneIncoming } from 'lucide-react';

interface Country {
    name: string;
    code: string;
    flag: string;
}

const countries: Country[] = [
    { name: 'Cameroun', code: '+237', flag: '🇨🇲' },
    { name: 'Gabon', code: '+241', flag: '🇬🇦' },
];

interface PhonePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    onCountryChange?: (country: Country) => void;
}

const PhonePicker: React.FC<PhonePickerProps> = ({
    label,
    error,
    className,
    id,
    onCountryChange,
    ...props
}) => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

    const handleCountryChange = (val: string) => {
        const country = countries.find(c => c.code === val);
        if (country) {
            setSelectedCountry(country);
            onCountryChange?.(country);
        }
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#6366f1',
                    borderRadius: 16,
                    colorBgElevated: '#111111',
                    colorBorder: 'rgba(255,255,255,0.1)',
                },
            }}
        >
            <div className="flex flex-col gap-2.5 w-full group">
                {label && (
                    <div className="flex items-center gap-2 px-1">
                        <PhoneIncoming size={12} className="text-indigo-500 opacity-70" />
                        <label htmlFor={id} className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            {label}
                        </label>
                    </div>
                )}

                <div className={cn(
                    "relative flex items-stretch h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 ring-0",
                    "group-focus-within:bg-white/10 group-focus-within:border-indigo-500/50 group-focus-within:ring-4 group-focus-within:ring-indigo-500/10",
                    error && "border-red-500/50 group-focus-within:border-red-500 group-focus-within:ring-red-500/10"
                )}>
                    {/* Country Selector Container */}
                    <div className="flex items-center bg-white/5 border-r border-white/10 hover:bg-white/10 transition-colors pointer-events-auto">
                        <Select
                            defaultValue={countries[0].code}
                            variant="borderless"
                            className="phone-country-select w-[120px]"
                            onChange={handleCountryChange}
                            suffixIcon={<ChevronDown size={14} className="text-gray-500 pointer-events-none" />}
                            dropdownStyle={{
                                backgroundColor: '#111111',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '8px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                            popupMatchSelectWidth={180}
                            options={countries.map(c => ({
                                value: c.code,
                                label: (
                                    <div className="flex items-center gap-3 py-1.5">
                                        <span className="text-xl">{c.flag}</span>
                                        <div className="flex flex-col leading-none">
                                            <span className="text-[11px] font-black uppercase tracking-tight text-white mb-0.5">{c.name}</span>
                                            <span className="text-[10px] font-bold text-gray-500">{c.code}</span>
                                        </div>
                                    </div>
                                )
                            }))}
                            labelRender={() => (
                                <div className="flex items-center gap-2.5 pl-1">
                                    <span className="text-xl leading-none">{selectedCountry.flag}</span>
                                    <span className="text-white font-black text-sm tracking-tight">{selectedCountry.code}</span>
                                </div>
                            )}
                        />
                    </div>

                    {/* Numeric Input */}
                    <input
                        id={id}
                        type="tel"
                        className={cn(
                            'flex-1 bg-transparent border-none text-white placeholder-gray-600 outline-none px-6 font-black text-lg tracking-[0.15em] w-full',
                            className
                        )}
                        {...props}
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-1.5 px-1 mt-0.5">
                        <div className="w-1 h-1 rounded-full bg-red-500" />
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest leading-none">
                            {error}
                        </p>
                    </div>
                )}
            </div>

            <style>{`
                .phone-country-select .ant-select-selector { height: 100% !important; display: flex !important; align-items: center !important; }
                .phone-country-select .ant-select-selection-search { inset-inline-start: 12px !important; }
                .ant-select-item-option { border-radius: 12px !important; margin-bottom: 4px !important; transition: all 0.2s !important; }
                .ant-select-item-option-active { background: rgba(255, 255, 255, 0.05) !important; }
                .ant-select-item-option-selected { background: rgba(99, 102, 241, 0.15) !important; }
            `}</style>
        </ConfigProvider>
    );
};

export default PhonePicker;
