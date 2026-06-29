import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-ocean text-white hover:bg-[#082b45] focus:ring-[#288DC2]',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-muted focus:ring-brand-sky',
  outline: 'border border-border bg-background text-foreground hover:bg-secondary focus:ring-brand-sky',
  ghost: 'bg-transparent text-foreground hover:bg-secondary focus:ring-brand-sky',
  danger: 'bg-destructive text-destructive-foreground hover:opacity-90 focus:ring-destructive',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
