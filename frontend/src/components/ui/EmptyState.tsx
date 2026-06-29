import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 px-6 py-10 text-center">
      <Icon className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
