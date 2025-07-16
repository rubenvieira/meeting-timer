import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Apple, TestTube, Users, Clock, Timer } from 'lucide-react';

interface TimerData {
  minutes: number;
  mode: string;
  label: string;
}

interface PresetTimerGridProps {
  onStartTimer: (timerData: TimerData) => void;
}

interface PresetTimer {
  id: string;
  label: string;
  minutes: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: string;
}

const presetTimers: PresetTimer[] = [
  // Coffee Break
  { id: 'coffee-5', label: '5 min', minutes: 5, icon: Coffee, color: 'timer-orange', category: 'Coffee' },
  { id: 'coffee-10', label: '10 min', minutes: 10, icon: Coffee, color: 'timer-orange', category: 'Coffee' },
  { id: 'coffee-15', label: '15 min', minutes: 15, icon: Coffee, color: 'timer-orange', category: 'Coffee' },
  
  // Exercise
  { id: 'exercise-45', label: '45 min', minutes: 45, icon: Apple, color: 'timer-success', category: 'Exercise' },
  { id: 'exercise-60', label: '60 min', minutes: 60, icon: Apple, color: 'timer-success', category: 'Exercise' },
  
  // Lab Work
  { id: 'lab-30', label: '30 min', minutes: 30, icon: TestTube, color: 'timer-blue', category: 'Lab' },
  { id: 'lab-45', label: '45 min', minutes: 45, icon: TestTube, color: 'timer-blue', category: 'Lab' },
  { id: 'lab-60', label: '60 min', minutes: 60, icon: TestTube, color: 'timer-blue', category: 'Lab' },
  
  // Meeting
  { id: 'meeting-30', label: '30 min', minutes: 30, icon: Users, color: 'timer-purple', category: 'Meeting' },
  { id: 'meeting-60', label: '60 min', minutes: 60, icon: Users, color: 'timer-purple', category: 'Meeting' },
  
  // Pomodoro
  { id: 'pomodoro-25', label: '25 min', minutes: 25, icon: Timer, color: 'timer-teal', category: 'Focus' },
  { id: 'pomodoro-break', label: '5 min', minutes: 5, icon: Clock, color: 'timer-warning', category: 'Break' },
];

export const PresetTimerGrid: React.FC<PresetTimerGridProps> = ({ onStartTimer }) => {
  const handlePresetClick = (preset: PresetTimer) => {
    const modeMap: { [key: string]: string } = {
      'Coffee': 'coffee',
      'Exercise': 'workout',
      'Lab': 'lab',
      'Meeting': 'meeting',
      'Focus': 'focus',
      'Break': 'break',
    };
    
    onStartTimer({
      minutes: preset.minutes,
      mode: modeMap[preset.category] || 'focus',
      label: `${preset.category} (${preset.label})`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground flex items-center">
        <Timer className="h-5 w-5 mr-2 text-primary" />
        Preset Timers
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {presetTimers.map((preset) => (
          <Card
            key={preset.id}
            className="group cursor-pointer bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 hover:shadow-card hover:scale-105 active:scale-95"
            onClick={() => handlePresetClick(preset)}
          >
            <CardContent className="p-4 flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full bg-${preset.color}/20 group-hover:bg-${preset.color}/30 transition-colors`}>
                <preset.icon className={`h-6 w-6 text-${preset.color}`} />
              </div>
              
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">{preset.label}</div>
                <div className="text-xs text-muted-foreground">{preset.category}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};