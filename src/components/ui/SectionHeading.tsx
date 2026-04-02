import React from 'react';

interface SectionHeadingProps {
    tag: string;
    tagColor?: string;
    title: string;
    description?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
    tag,
    tagColor = 'text-indigo-500',
    title,
    description,
}) => {
    return (
        <div className="text-center mb-16 md:mb-20">
            <h2 className={`text-sm font-bold tracking-widest uppercase mb-4 ${tagColor}`}>
                {tag}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{title}</h3>
            {description && (
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;
