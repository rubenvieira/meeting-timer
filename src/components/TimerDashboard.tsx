import React, { useState, useEffect } from 'react';
import { TimezoneSelector } from './TimezoneSelector';
import { StartTimerSection } from './StartTimerSection';
import { PresetTimerGrid } from './PresetTimerGrid';
import { ThemeToggle } from './ThemeToggle';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const TimerDashboard: React.FC = () => {
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const formattedTime = formatInTimeZone(currentTime, selectedTimezone, 'h:mm:ss a');
  const formattedDate = formatInTimeZone(currentTime, selectedTimezone, 'EEEE, MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-timer-purple/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-foreground">Timer Dashboard</div>
          <div className="hidden md:block text-sm text-muted-foreground">
            {formattedDate} • {formattedTime}
          </div>
        </div>
        <ThemeToggle theme={theme} onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 pb-8 space-y-8">
        {/* Timezone Selector */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TimezoneSelector 
            selectedTimezone={selectedTimezone} 
            onTimezoneChange={setSelectedTimezone}
          />
          <div className="md:hidden text-sm text-muted-foreground">
            {formattedDate} • {formattedTime}
          </div>
        </section>

        {/* Start Timer Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StartTimerSection timezone={selectedTimezone} />
          <PresetTimerGrid />
        </section>
      </main>
    </div>
  );
};