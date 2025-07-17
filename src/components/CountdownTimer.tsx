import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
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
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatInTimeZone } from 'date-fns-tz';

interface CountdownTimerProps {
  initialMinutes: number;
  mode: string;
  label: string;
  timezone: string;
  onBack: () => void;
}

const modeIcons = {
  coffee: Coffee,
  workout: Apple,
  lab: TestTube,
  meeting: Users,
  focus: Timer,
  break: Clock,
};

const modeColors = {
  coffee: 'timer-orange',
  workout: 'timer-success',
  lab: 'timer-blue',
  meeting: 'timer-purple',
  focus: 'timer-teal',
  break: 'timer-warning',
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  mode,
  label,
  timezone,
  onBack,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notes, setNotes] = useState('');
  const [pastedImages, setPastedImages] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const totalSeconds = initialMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsComplete(true);
            setIsRunning(false);
            if (soundEnabled) {
              // Play notification sound (you could add actual audio here)
              toast({
                title: "Timer Complete!",
                description: `${label} timer has finished`,
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, soundEnabled, label, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(initialMinutes * 60);
    setIsRunning(false);
    setIsComplete(false);
  };

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

  const ModeIcon = modeIcons[mode as keyof typeof modeIcons] || Timer;
  const modeColor = modeColors[mode as keyof typeof modeColors] || 'timer-teal';

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
      </header>

      {/* Main Timer Display */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-120px)]">
          
          {/* Timer Section */}
          <div className="flex flex-col items-center justify-center space-y-8">
            
            {/* Mode Icon and Label */}
            <div className="text-center space-y-4">
              <div className={`mx-auto p-6 rounded-full bg-${modeColor}/20 w-fit`}>
                <ModeIcon className={`h-12 w-12 text-${modeColor}`} />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">{label}</h1>
            </div>

            {/* Progress Ring */}
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <Progress 
                value={progress} 
                className="absolute inset-0 w-full h-full [&>div]:rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-6xl md:text-8xl font-mono font-bold ${
                    isComplete ? 'text-primary' : 'text-foreground'
                  } ${isComplete ? 'animate-pulse' : ''}`}>
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
            <div className="flex items-center space-x-4">
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
                onClick={handlePlayPause}
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
            </div>

            {/* Completion Message */}
            {isComplete && (
              <Card className="bg-primary/10 border-primary/30 backdrop-blur-sm animate-pulse">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-primary">
                    🎉 Timer Complete!
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
                  placeholder="Add notes, paste screenshots, or other meeting content here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onPaste={handlePaste}
                  className="flex-1 min-h-[200px] bg-background/50 border-border/50 resize-none"
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