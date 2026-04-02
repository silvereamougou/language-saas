import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
	status: string;
	label?: string; // Manual override (e.g. "REQUEST NOW")
	size?: 'xs' | 'sm' | 'md' | 'lg';
	variant?: 'ribbon' | 'status'; // ribbon: card corner / status: badge pill
	className?: string;
}

const getStatusStyles = (status: string, size: string, variant: string) => {
	const baseStyles =
		'inline-flex items-center leading-none select-none transition-all duration-300';

	// Size mapping based on ListingCard [10px] and [9px] specs
	const sizeStyles = {
		xs: 'px-1.5 py-0.5 text-[8px]',
		sm: 'px-2.5 py-1 text-[9px] font-semibold',
		md: 'px-3.5 py-2 text-[10px] font-bold uppercase tracking-tight',
		lg: 'px-4.5 py-2.5 text-[11px] font-bold uppercase tracking-tighter',
	};

	// Shape mapping from ListingCard: status bubble vs ribbon
	const variantStyles = {
		ribbon: 'rounded-br-xl rounded-tl-sm shadow-md', // Matching Badge.Ribbon placement start
		status: 'rounded-full border shadow-soft whitespace-nowrap px-3 text-[10px]', // Matching status bubble
	};

	const statusLower = status.toLowerCase();

	// Color resolution from ListingCard logic
	const typeStyles = {
		// General statuses
		active: variant === 'ribbon' 
			? 'bg-[#4ade80] text-white' // The Green Ribbon
			: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-700/10 dark:text-green-500 dark:border-green-700/50',
		
		draft: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/80 dark:text-gray-400 dark:border-gray-700/80',
		
		unpublished: 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-700/10 dark:text-yellow-400 dark:border-yellow-700/80',
		
		published: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-700/10 dark:text-green-500 dark:border-green-700/50',

		// Moderation/Action statuses
		approved: 'bg-[#4ade80] text-white',
		pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
		rejected: 'bg-rose-50 text-rose-700 border-rose-100',
		
		default: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-700/20 dark:text-indigo-400 dark:border-indigo-700/50',
	};

	const match =
		typeStyles[statusLower as keyof typeof typeStyles] ||
		typeStyles.default;

	return cn(baseStyles, sizeStyles[size as keyof typeof sizeStyles], variantStyles[variant as keyof typeof variantStyles], match);
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
	status = 'default',
	label,
	size = 'sm',
	variant = 'status',
	className = '',
}) => {
	const { t } = useTranslation();
	const safeStatus = status || 'default';

	// Text logic matching ListingCard's {status} output
	const displayStatus = label || t(`common.status.${safeStatus.toLowerCase()}`, {
		defaultValue: safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)
	});

	return (
		<span className={cn(getStatusStyles(safeStatus, size, variant), className)}>
			{displayStatus}
		</span>
	);
};

export default StatusBadge;
