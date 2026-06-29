import { Shield, SunMoon } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';

export function StyleGuide() {
  return (
    <Card title="Raw UI Style Guide" subtitle="Base components used throughout this Phase 0 government review prototype.">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Buttons</p>
          <div className="flex flex-wrap gap-2">
            <Button icon={<Shield className="h-4 w-4" />}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost" icon={<SunMoon className="h-4 w-4" />}>Ghost</Button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Badges</p>
          <div className="flex flex-wrap gap-2">
            <Badge tone="success">READY</Badge>
            <Badge tone="warning">CONDITIONAL</Badge>
            <Badge tone="danger">NOT READY</Badge>
            <Badge tone="info">GOVERNED</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
