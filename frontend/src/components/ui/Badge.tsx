import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  neutral: 'bg-muted text-muted-foreground',
};

export function Badge({ children, tone = 'default', className = '' }: BadgeProps) {
  return <span className={['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', toneClasses[tone], className].join(' ')}>{children}</span>;
}
