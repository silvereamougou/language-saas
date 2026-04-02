import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    animation?: 'pulse' | 'wave' | 'none';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rectangular',
    animation = 'pulse',
    width,
    height,
    className,
    style,
    ...props
}) => {
    return (
        <div
            className={cn(
                'bg-white/5',
                variant === 'circular' && 'rounded-full',
                variant === 'rounded' && 'rounded-2xl',
                animation === 'pulse' && 'animate-pulse',
                animation === 'wave' && 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[wave_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/5 before:to-transparent',
                className
            )}
            style={{
                width: width,
                height: height,
                ...style,
            }}
            {...props}
        />
    );
};

export default Skeleton;
