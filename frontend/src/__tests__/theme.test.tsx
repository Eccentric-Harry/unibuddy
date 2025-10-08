import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider, useTheme } from '../lib/theme';
import { ThemeToggle } from '../components/ThemeToggle';

// Test component to access theme context
function ThemeConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  it('should provide default theme as system', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  it('should apply dark class to html element when theme is dark', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Set Dark'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should apply light class to html element when theme is light', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Set Light'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });

  it('should persist theme choice to localStorage', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Set Dark'));

    await waitFor(() => {
      expect(localStorage.getItem('cb_theme')).toBe('dark');
    });
  });

  it('should load theme from localStorage on mount', () => {
    localStorage.setItem('cb_theme', 'dark');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should update meta theme-color when theme changes', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Set Dark'));

    await waitFor(() => {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      expect(metaThemeColor?.getAttribute('content')).toBe('#0f172a');
    });
  });
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('should render compact variant with toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="compact" />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label');
  });

  it('should render expanded variant with all three options', () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="expanded" />
      </ThemeProvider>
    );

    expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
    expect(screen.getByLabelText('System theme')).toBeInTheDocument();
  });

  it('should toggle theme when compact button is clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="compact" />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // First click should set to dark (from system/light)
    fireEvent.click(button);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should set theme when expanded variant button is clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="expanded" />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByLabelText('Dark mode'));

    await waitFor(() => {
      expect(localStorage.getItem('cb_theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should indicate active theme with aria-pressed', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="expanded" />
      </ThemeProvider>
    );

    const darkButton = screen.getByLabelText('Dark mode');
    fireEvent.click(darkButton);

    await waitFor(() => {
      expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('should throw error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeConsumer />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('should provide toggleTheme function', async () => {
    function ToggleTest() {
      const { toggleTheme, resolvedTheme } = useTheme();
      return (
        <div>
          <div data-testid="resolved">{resolvedTheme}</div>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    }

    render(
      <ThemeProvider>
        <ToggleTest />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle');

    fireEvent.click(button);

    await waitFor(() => {
      const resolved = screen.getByTestId('resolved').textContent;
      expect(resolved === 'dark' || resolved === 'light').toBe(true);
    });
  });
});

