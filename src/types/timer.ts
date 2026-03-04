export type TimerMode = 'coffee' | 'workout' | 'lab' | 'meeting' | 'focus' | 'break' | 'session' | 'training';

export interface TimerData {
  minutes: number;
  mode: TimerMode;
  label: string;
}
