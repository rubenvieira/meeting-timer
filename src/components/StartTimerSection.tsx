import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Coffee, Dumbbell, TestTube, Users, Clock } from 'lucide-react';

interface TimerData {
  minutes: number;
  mode: string;
  label: string;
}

interface StartTimerSectionProps {
  timezone: string;
  onStartTimer: (timerData: TimerData) => void;
}

const timerModes = [
  { value: 'coffee', label: 'Coffee Break', icon: Coffee, color: 'timer-orange' },
  { value: 'workout', label: 'Workout', icon: Dumbbell, color: 'timer-success' },
  { value: 'lab', label: 'Lab Work', icon: TestTube, color: 'timer-blue' },
  { value: 'meeting', label: 'Meeting', icon: Users, color: 'timer-purple' },
];

export const StartTimerSection: React.FC<StartTimerSectionProps> = ({ timezone, onStartTimer }) => {
  const [time, setTime] = useState('12:00');
  const [ampm, setAmpm] = useState('PM');
  const [selectedMode, setSelectedMode] = useState('coffee');

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const adjustTime = (minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    setTime(`${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`);
  };

  const setTopOfHour = () => {
    const [hours] = time.split(':').map(Number);
    setTime(`${hours.toString().padStart(2, '0')}:00`);
  };

  const handleStartTimer = () => {
    const selectedModeData = timerModes.find(mode => mode.value === selectedMode);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calculate timer duration based on current time vs selected time
    const now = new Date();
    const targetTime = new Date();
    let targetHours = hours;
    if (ampm === 'PM' && hours !== 12) targetHours += 12;
    if (ampm === 'AM' && hours === 12) targetHours = 0;
    
    targetTime.setHours(targetHours, minutes, 0, 0);
    
    // If target time is in the past, assume it's for tomorrow
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const durationMinutes = Math.round((targetTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (durationMinutes <= 0) {
      return;
    }
    
    onStartTimer({
      minutes: durationMinutes,
      mode: selectedMode,
      label: `${selectedModeData?.label} (${time} ${ampm})`,
    });
  };

  return (
    <Card className="bg-card/50 border-border/50 shadow-card backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Start Timer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Mode Icons */}
        <div className="flex items-center justify-center space-x-4">
          {timerModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setSelectedMode(mode.value)}
              className={`p-3 rounded-full transition-all duration-200 ${
                selectedMode === mode.value
                  ? 'bg-primary/20 text-primary shadow-glow'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted/70'
              }`}
              aria-label={mode.label}
            >
              <mode.icon className="h-6 w-6" />
            </button>
          ))}
        </div>

        {/* Time Input */}
        <div className="flex items-center space-x-2">
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="flex-1 bg-background/50 border-border/50 text-lg font-mono"
          />
          <Select value={ampm} onValueChange={setAmpm}>
            <SelectTrigger className="w-20 bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Adjustment Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTime(-1)}
            className="bg-timer-purple/20 border-timer-purple/30 text-timer-purple hover:bg-timer-purple/30"
          >
            -1 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTime(1)}
            className="bg-timer-success/20 border-timer-success/30 text-timer-success hover:bg-timer-success/30"
          >
            +1 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTime(5)}
            className="bg-timer-teal/20 border-timer-teal/30 text-timer-teal hover:bg-timer-teal/30"
          >
            +5 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTime(10)}
            className="bg-timer-warning/20 border-timer-warning/30 text-timer-warning hover:bg-timer-warning/30"
          >
            +10 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={setTopOfHour}
            className="bg-timer-blue/20 border-timer-blue/30 text-timer-blue hover:bg-timer-blue/30"
          >
            Top of Hour
          </Button>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStartTimer}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:shadow-glow transition-all duration-200"
          size="lg"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Timer
        </Button>
      </CardContent>
    </Card>
  );
};