import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { Button } from './ui/button';

interface ThemeToggleProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

export function ThemeToggle({ variant = 'compact', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={className}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        aria-pressed={resolvedTheme === 'dark'}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        )}
      </Button>
    );
  }

  // Expanded variant with all three options
  return (
    <div className={`flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`}>
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="gap-2"
        aria-label="Light mode"
        aria-pressed={theme === 'light'}
      >
        <Sun className="h-4 w-4" />
        <span className="hidden sm:inline">Light</span>
      </Button>

      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="gap-2"
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="h-4 w-4" />
        <span className="hidden sm:inline">Dark</span>
      </Button>

      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('system')}
        className="gap-2"
        aria-label="System theme"
        aria-pressed={theme === 'system'}
      >
        <Monitor className="h-4 w-4" />
        <span className="hidden sm:inline">System</span>
      </Button>
    </div>
  );
}

