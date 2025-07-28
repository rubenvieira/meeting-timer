import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeToggle }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onThemeToggle}
      className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-foreground" />
      )}
    </Button>
  );
};