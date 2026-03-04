import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, Coffee, Apple, TestTube, Users, Timer, Clock } from 'lucide-react';
import { TimerHistoryEntry, TimerMode } from '@/types/timer';
import { formatDistanceToNow } from 'date-fns';

const modeIcons: Record<TimerMode, React.ComponentType<{ className?: string }>> = {
  coffee: Coffee,
  workout: Apple,
  lab: TestTube,
  meeting: Users,
  focus: Timer,
  break: Clock,
  session: Users,
  training: TestTube,
};

const modeTextClasses: Record<TimerMode, string> = {
  coffee: 'text-timer-orange',
  workout: 'text-timer-success',
  lab: 'text-timer-blue',
  meeting: 'text-timer-purple',
  focus: 'text-timer-teal',
  break: 'text-timer-warning',
  session: 'text-timer-purple',
  training: 'text-timer-blue',
};

interface TimerHistoryProps {
  history: TimerHistoryEntry[];
  onClearHistory: () => void;
}

export const TimerHistory: React.FC<TimerHistoryProps> = ({ history, onClearHistory }) => {
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="bg-card/50 border-border/50 shadow-card backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5 text-primary" />
          <span>Timer History</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((entry) => {
            const ModeIcon = modeIcons[entry.mode] || Timer;
            const textClass = modeTextClasses[entry.mode] || 'text-timer-teal';

            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="flex items-center space-x-3">
                  <ModeIcon className={`h-4 w-4 ${textClass}`} />
                  <span className="text-sm font-medium text-foreground">{entry.label}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-mono text-muted-foreground">
                    {formatDuration(entry.durationMinutes)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(entry.completedAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
