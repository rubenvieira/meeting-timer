import { useLocalStorage } from './useLocalStorage';
import { TimerHistoryEntry } from '@/types/timer';

const MAX_HISTORY = 20;

export function useTimerHistory() {
  const [history, setHistory] = useLocalStorage<TimerHistoryEntry[]>('timer-history', []);

  const addEntry = (entry: Omit<TimerHistoryEntry, 'id'>) => {
    setHistory((prev) => {
      const newEntry: TimerHistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
      };
      return [newEntry, ...prev].slice(0, MAX_HISTORY);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addEntry, clearHistory };
}
