import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Volume2,
  VolumeX,
  Coffee,
  Apple,
  TestTube,
  Users,
  Timer,
  Clock,
  FileImage,
  Trash2,
  Keyboard,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatInTimeZone } from 'date-fns-tz';
import { TimerMode, TimerData } from '@/types/timer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface CountdownTimerProps {
  initialMinutes: number;
  mode: TimerMode;
  label: string;
  timezone: string;
  startedAt: number;
  onBack: () => void;
  onTimerComplete: (label: string, mode: TimerData['mode'], durationMinutes: number) => void;
}

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

const modeBgClasses: Record<TimerMode, string> = {
  coffee: 'bg-timer-orange/20',
  workout: 'bg-timer-success/20',
  lab: 'bg-timer-blue/20',
  meeting: 'bg-timer-purple/20',
  focus: 'bg-timer-teal/20',
  break: 'bg-timer-warning/20',
  session: 'bg-timer-purple/20',
  training: 'bg-timer-blue/20',
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

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  mode,
  label,
  timezone,
  startedAt,
  onBack,
  onTimerComplete,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    const remaining = Math.max(0, initialMinutes * 60 - Math.floor(elapsed));
    return remaining;
  });
  const [isRunning, setIsRunning] = useState(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    return initialMinutes * 60 - Math.floor(elapsed) > 0;
  });
  const [isComplete, setIsComplete] = useState(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    return initialMinutes * 60 - Math.floor(elapsed) <= 0;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notes, setNotes] = useState('');
  const [pastedImages, setPastedImages] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const completedRef = useRef(false);
  const { toast } = useToast();

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Request desktop notification permission
  useEffect(() => {
    if (isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isRunning]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (time: number, frequency: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start(time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        oscillator.stop(time + 0.3);
      };
      const now = audioContext.currentTime;
      playBeep(now, 880);
      playBeep(now + 0.35, 880);
      playBeep(now + 0.7, 1174.66);
    } catch {
      // Web Audio API not available
    }
  };

  const handleComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsComplete(true);
    setIsRunning(false);
    if (soundEnabled) {
      playNotificationSound();
    }
    toast({
      title: "Timer Complete!",
      description: `${label} timer has finished`,
    });
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: `${label} timer has finished`,
        tag: 'timer-complete',
      });
    }
    onTimerComplete(label, mode, initialMinutes);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeLeft === 0 && !isComplete) {
        handleComplete();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft > 0]);

  // Browser tab title updates
  useEffect(() => {
    if (isComplete) {
      document.title = 'Timer Complete! — Meeting Timer';
    } else if (!isRunning && timeLeft < totalSeconds) {
      document.title = `Paused — ${formatTime(timeLeft)} — Meeting Timer`;
    } else if (isRunning) {
      document.title = `${formatTime(timeLeft)} — Meeting Timer`;
    }

    return () => {
      document.title = 'Meeting Timer';
    };
  }, [timeLeft, isRunning, isComplete]);

  // Flash title when complete
  useEffect(() => {
    if (!isComplete) return;
    const flashInterval = setInterval(() => {
      document.title = document.title === 'Timer Complete! — Meeting Timer'
        ? `${label} — Meeting Timer`
        : 'Timer Complete! — Meeting Timer';
    }, 1000);
    return () => {
      clearInterval(flashInterval);
      document.title = 'Meeting Timer';
    };
  }, [isComplete, label]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTotalSeconds(initialMinutes * 60);
    setTimeLeft(initialMinutes * 60);
    setIsRunning(false);
    setIsComplete(false);
    completedRef.current = false;
  };

  const handleStartNew = () => {
    setTotalSeconds(initialMinutes * 60);
    setTimeLeft(initialMinutes * 60);
    setIsComplete(false);
    completedRef.current = false;
    setIsRunning(true);
  };

  const handleAddTime = (additionalSeconds: number) => {
    setTotalSeconds(prev => prev + additionalSeconds);
    setTimeLeft(prev => prev + additionalSeconds);
    if (isComplete) {
      setIsComplete(false);
      completedRef.current = false;
      setIsRunning(true);
    }
  };

  // Keyboard shortcuts
  const shortcuts = useMemo(() => ({
    ' ': () => {
      if (isComplete) handleStartNew();
      else handlePlayPause();
    },
    'r': handleReset,
    'Escape': onBack,
    'm': () => setSoundEnabled(prev => !prev),
    'n': () => notesRef.current?.focus(),
  }), [isComplete, isRunning]);

  useKeyboardShortcuts(shortcuts);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setPastedImages(prev => [...prev, result]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getEndTime = () => {
    const endTime = new Date(Date.now() + timeLeft * 1000);
    return formatInTimeZone(endTime, timezone, 'h:mm:ss a');
  };

  const getTimerTextClass = () => {
    if (isComplete) return 'text-primary animate-pulse';
    if (timeLeft <= 10) return 'text-destructive animate-pulse';
    if (timeLeft <= 60) return 'text-timer-warning';
    return 'text-foreground';
  };

  const ModeIcon = modeIcons[mode] || Timer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-timer-purple/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-card/50 border-border/50 hover:bg-card/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-card/50 border-border/50 hover:bg-card/80"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="text-xs space-y-1">
                  <div><kbd className="px-1 bg-muted rounded text-[10px]">Space</kbd> Play/Pause</div>
                  <div><kbd className="px-1 bg-muted rounded text-[10px]">R</kbd> Reset</div>
                  <div><kbd className="px-1 bg-muted rounded text-[10px]">Esc</kbd> Back</div>
                  <div><kbd className="px-1 bg-muted rounded text-[10px]">M</kbd> Mute/Unmute</div>
                  <div><kbd className="px-1 bg-muted rounded text-[10px]">N</kbd> Focus Notes</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-card/50 border-border/50 hover:bg-card/80"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Timer Display */}
      <main className="relative z-10 container mx-auto pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 min-h-[calc(100vh-120px)]">

          {/* Timer Section */}
          <div className="flex flex-col items-center justify-center space-y-8">

            {/* Mode Icon and Label */}
            <div className="text-center space-y-4">
              <div className={`mx-auto p-6 rounded-full ${modeBgClasses[mode]} w-fit`}>
                <ModeIcon className={`h-12 w-12 ${modeTextClasses[mode]}`} />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">{label}</h1>
            </div>

            {/* Progress Ring */}
            <div className="relative w-80 h-80 md:w-96 md:h-96 xl:w-[28rem] xl:h-[28rem] 2xl:w-[32rem] 2xl:h-[32rem]">
              <Progress
                value={progress}
                className="absolute inset-0 w-full h-full [&>div]:rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-6xl md:text-8xl xl:text-9xl font-mono font-bold ${getTimerTextClass()} transition-colors duration-500`}>
                    {formatTime(timeLeft)}
                  </div>
                  {!isComplete && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Ends at {getEndTime()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timer Info */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-foreground">
                      {Math.floor(timeLeft / 60)}
                    </div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-foreground">
                      {timeLeft % 60}
                    </div>
                    <div className="text-sm text-muted-foreground">Seconds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-primary">
                      {Math.round(progress)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Complete</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="bg-card/50 border-border/50 hover:bg-card/80"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>

              <Button
                size="lg"
                onClick={isComplete ? handleStartNew : handlePlayPause}
                className={`px-8 ${
                  isComplete
                    ? 'bg-primary hover:bg-primary/90'
                    : isRunning
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-primary hover:bg-primary/90'
                } text-primary-foreground shadow-glow`}
              >
                {isComplete ? (
                  <>
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Start New
                  </>
                ) : isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Resume
                  </>
                )}
              </Button>

              {/* Add Time Buttons */}
              {!isComplete && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTime(60)}
                    className="bg-card/50 border-border/50 hover:bg-card/80"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    1 min
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTime(300)}
                    className="bg-card/50 border-border/50 hover:bg-card/80"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    5 min
                  </Button>
                </>
              )}
            </div>

            {/* Completion Message */}
            {isComplete && (
              <Card className="bg-primary/10 border-primary/30 backdrop-blur-sm animate-pulse">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-primary">
                    Timer Complete!
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Your {label.toLowerCase()} session has finished
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notes Section */}
          <div className="flex flex-col space-y-4">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                  <FileImage className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Meeting Notes</h3>
                </div>

                <Textarea
                  ref={notesRef}
                  placeholder="Add notes, paste screenshots, or other meeting content here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onPaste={handlePaste}
                  className="flex-1 min-h-[200px] xl:min-h-[300px] bg-background/50 border-border/50 resize-none"
                />

                {pastedImages.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <div className="text-sm font-medium text-muted-foreground">
                      Pasted Images ({pastedImages.length})
                    </div>
                    <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
                      {pastedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Pasted image ${index + 1}`}
                            className="w-full h-auto rounded-lg border border-border/50 shadow-sm"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
