import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';

interface BaseLayoutProps {
  children: ReactNode;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function BaseLayout({ children, darkMode, onToggleTheme }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="section-title">Brightcone · NC DHHS Phase 0 Prototype</p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">Rural Health Transformation Assessment Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            icon={darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          >
            {darkMode ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
