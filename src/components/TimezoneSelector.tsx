import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const timezones = [
  { value: 'America/New_York', label: '-05:00 | America/New_York (EST)' },
  { value: 'America/Chicago', label: '-06:00 | America/Chicago (CST)' },
  { value: 'America/Denver', label: '-07:00 | America/Denver (MST)' },
  { value: 'America/Los_Angeles', label: '-08:00 | America/Los_Angeles (PST)' },
  { value: 'Europe/London', label: '+00:00 | Europe/London (GMT)' },
  { value: 'Europe/Paris', label: '+01:00 | Europe/Paris (CET)' },
  { value: 'Europe/Moscow', label: '+03:00 | Europe/Moscow (MSK)' },
  { value: 'Asia/Tokyo', label: '+09:00 | Asia/Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: '+08:00 | Asia/Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: '+05:30 | Asia/Kolkata (IST)' },
  { value: 'Australia/Sydney', label: '+11:00 | Australia/Sydney (AEDT)' },
  { value: 'Pacific/Auckland', label: '+13:00 | Pacific/Auckland (NZDT)' },
];

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  onTimezoneChange,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-foreground">Time Zone</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select your preferred timezone for timer scheduling</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select value={selectedTimezone} onValueChange={onTimezoneChange}>
        <SelectTrigger className="w-[280px] bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent className="bg-popover backdrop-blur-sm border-border/50">
          {timezones.map((timezone) => (
            <SelectItem key={timezone.value} value={timezone.value}>
              {timezone.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};