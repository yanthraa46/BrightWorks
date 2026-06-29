import { AlertTriangle } from 'lucide-react';

export function PrototypeNotice() {
  return (
    <div className="demo-banner flex items-start gap-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 text-brand-sky" aria-hidden="true" />
      <div>
        <p className="font-semibold text-foreground">Static prototype / demo data only</p>
        <p className="mt-1 text-sm text-muted-foreground">
          All charts, provider names, readiness scores, vendor findings, AI governance indicators, and audit records in this dashboard are illustrative Phase 0 demo data. They are not live NC DHHS operational feeds.
        </p>
      </div>
    </div>
  );
}
