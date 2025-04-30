import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { TextEntry, EmotionType } from '../utils/types';
import { exportToCSV } from '../utils/csvParser';
import toast from 'react-hot-toast';

interface DataContextType {
  entries: TextEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TextEntry[]>>;
  currentEntryIndex: number;
  setCurrentEntryIndex: React.Dispatch<React.SetStateAction<number>>;
  currentEntry: TextEntry | null;
  updateEmotionScore: (emotion: EmotionType, score: number) => void;
  goToNextEntry: () => void;
  goToPreviousEntry: () => void;
  hasEntries: boolean;
  totalEntries: number;
  exportData: () => void;
  progressPercentage: number;
  completedEntries: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<TextEntry[]>([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

  const currentEntry = useMemo(() => {
    return entries.length > 0 && currentEntryIndex < entries.length
      ? entries[currentEntryIndex]
      : null;
  }, [entries, currentEntryIndex]);

  const hasEntries = entries.length > 0;
  const totalEntries = entries.length;
  
  const completedEntries = useMemo(() => {
    return entries.filter(entry => 
      Object.values(entry.emotions).some(score => score > 0)
    ).length;
  }, [entries]);

  const progressPercentage = totalEntries > 0 
    ? (completedEntries / totalEntries) * 100 
    : 0;

  const updateEmotionScore = (emotion: EmotionType, score: number) => {
    if (!currentEntry) return;

    setEntries(prev => 
      prev.map(entry => 
        entry.id === currentEntry.id 
          ? { 
              ...entry, 
              emotions: { 
                ...entry.emotions, 
                [emotion]: score 
              } 
            }
          : entry
      )
    );
  };

  const goToNextEntry = () => {
    if (currentEntryIndex < entries.length - 1) {
      setCurrentEntryIndex(prev => prev + 1);
    } else {
      toast.success('You have reached the end of the entries!');
    }
  };

  const goToPreviousEntry = () => {
    if (currentEntryIndex > 0) {
      setCurrentEntryIndex(prev => prev - 1);
    } else {
      toast('This is the first entry.');
    }
  };

  const exportData = () => {
    if (entries.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const csvContent = exportToCSV(entries);
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `emotion-labels-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextEntry();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousEntry();
      } else if (e.key >= '1' && e.key <= '8') {
        // Map number keys 1-8 to emotions
        const emotionIndex = parseInt(e.key) - 1;
        const emotions: EmotionType[] = ['joy', 'sadness', 'anticipation', 'surprise', 'anger', 'fear', 'disgust', 'trust'];
        if (emotionIndex >= 0 && emotionIndex < emotions.length) {
          const emotion = emotions[emotionIndex];
          // Toggle between 0 and 1
          const currentScore = currentEntry?.emotions[emotion] || 0;
          const newScore = currentScore === 0 ? 1 : 0;
          updateEmotionScore(emotion, newScore);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentEntry]);

  const value = {
    entries,
    setEntries,
    currentEntryIndex,
    setCurrentEntryIndex,
    currentEntry,
    updateEmotionScore,
    goToNextEntry,
    goToPreviousEntry,
    hasEntries,
    totalEntries,
    exportData,
    progressPercentage,
    completedEntries,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;