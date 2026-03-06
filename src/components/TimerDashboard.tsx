import React, { useState, useEffect } from 'react';
import { TimezoneSelector } from './TimezoneSelector';
import { StartTimerSection } from './StartTimerSection';
import { PresetTimerGrid } from './PresetTimerGrid';
import { CountdownTimer } from './CountdownTimer';
import { ThemeToggle } from './ThemeToggle';
import { TimerHistory } from './TimerHistory';
import { formatInTimeZone } from 'date-fns-tz';
import { TimerData, ActiveTimerState } from '@/types/timer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTimerHistory } from '@/hooks/useTimerHistory';

export const TimerDashboard: React.FC = () => {
  const [selectedTimezone, setSelectedTimezone] = useLocalStorage('timer-timezone', 'America/New_York');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('timer-theme', 'dark');
  const [activeTimer, setActiveTimer] = useLocalStorage<ActiveTimerState | null>('timer-active', null);
  const { history, addEntry, clearHistory } = useTimerHistory();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    if (!activeTimer) {
      document.title = 'Meeting Timer';
    }
  }, [activeTimer]);

  const formattedTime = formatInTimeZone(currentTime, selectedTimezone, 'h:mm:ss a');
  const formattedDate = formatInTimeZone(currentTime, selectedTimezone, 'EEEE, MMMM d, yyyy');

  const handleStartTimer = (timerData: TimerData) => {
    setActiveTimer({
      ...timerData,
      startedAt: Date.now(),
    });
  };

  const handleBackToDashboard = () => {
    setActiveTimer(null);
  };

  const handleTimerComplete = (label: string, mode: TimerData['mode'], durationMinutes: number) => {
    addEntry({ label, mode, durationMinutes, completedAt: Date.now() });
    setActiveTimer(null);
  };

  if (activeTimer) {
    return (
      <CountdownTimer
        initialMinutes={activeTimer.minutes}
        mode={activeTimer.mode}
        label={activeTimer.label}
        timezone={selectedTimezone}
        startedAt={activeTimer.startedAt}
        onBack={handleBackToDashboard}
        onTimerComplete={handleTimerComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)] pointer-events-none" />

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
      <main className="relative z-10 container max-w-6xl mx-auto px-4 md:px-6 pb-8 space-y-8">
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
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 xl:col-span-5">
            <StartTimerSection
              timezone={selectedTimezone}
              onStartTimer={handleStartTimer}
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-7">
            <PresetTimerGrid onStartTimer={handleStartTimer} />
          </div>
        </section>

        {/* Timer History */}
        {history.length > 0 && (
          <section>
            <TimerHistory history={history} onClearHistory={clearHistory} />
          </section>
        )}
      </main>
    </div>
  );
};
