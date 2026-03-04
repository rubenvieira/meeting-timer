export type TimerMode = 'coffee' | 'workout' | 'lab' | 'meeting' | 'focus' | 'break' | 'session' | 'training';

export interface TimerData {
  minutes: number;
  mode: TimerMode;
  label: string;
}

export interface ActiveTimerState extends TimerData {
  startedAt: number;
}

export interface TimerHistoryEntry {
  id: string;
  label: string;
  mode: TimerMode;
  durationMinutes: number;
  completedAt: number;
}
