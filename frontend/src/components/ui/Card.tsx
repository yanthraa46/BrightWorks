import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Card({ title, subtitle, children, className = '', headerAction }: CardProps) {
  return (
    <section className={['gov-card', className].join(' ')}>
      {(title || subtitle || headerAction) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            {title ? <h3 className="text-lg font-semibold text-foreground">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {headerAction}
        </header>
      )}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
