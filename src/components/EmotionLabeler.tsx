// import React, { useMemo } from 'react';
import React from 'react';
import { useData } from '../contexts/DataContext';
import { EmotionType, emotions } from '../utils/types';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
// import EmotionChart from './EmotionChart';
import '../styles/EmotionLabeler.css';

const EmotionLabeler: React.FC = () => {
  const { 
    currentEntry, 
    updateEmotionScore, 
    goToNextEntry, 
    goToPreviousEntry,
    currentEntryIndex,
    totalEntries
  } = useData();

  // const hasSelectedEmotions = useMemo(() => {
  //   if (!currentEntry) return false;
  //   return Object.values(currentEntry.emotions).some(value => value > 0);
  // }, [currentEntry]);

  if (!currentEntry) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-700">No entries available</h2>
        <p className="text-gray-500 mt-2">Please upload a CSV file to start labeling</p>
      </div>
    );
  }

  const handleEmotionClick = (emotion: EmotionType) => {
    const currentValue = currentEntry.emotions[emotion];
    // Toggle between 0 and 1
    updateEmotionScore(emotion, currentValue === 0 ? 1 : 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Progress and navigation */}
      <div className="progress-container">
        <div className="text-sm text-gray-600">
          エントリー {currentEntryIndex + 1} / {totalEntries}
        </div>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousEntry}
            disabled={currentEntryIndex === 0}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous entry"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextEntry}
            disabled={currentEntryIndex === totalEntries - 1}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next entry"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Text display */}
      <div className="px-6 py-8 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">テキスト</h2>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[120px] text-lg">
          {currentEntry.text}
        </div>
      </div>
      
      {/* Emotion selection */}
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h3>感情ラベル選択</h3>
          <div className="text-sm text-gray-500">
            数字キー <span className="info">1-8</span> で選択できます
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {emotions.map((emotion, index) => (
            <button
              key={emotion.name}
              onClick={() => handleEmotionClick(emotion.name)}
              className={`
                p-4 rounded-lg border transition-all duration-200 flex flex-col items-center
                ${currentEntry.emotions[emotion.name] > 0
                  ? `bg-opacity-15 bg-${emotion.name} border-${emotion.name} shadow-sm`
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
              style={{
                backgroundColor: currentEntry.emotions[emotion.name] > 0 
                  ? `${emotion.color}15` 
                  : '',
                borderColor: currentEntry.emotions[emotion.name] > 0 
                  ? emotion.color 
                  : ''
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <span 
                  className="w-6 h-6 rounded-full mr-2"
                  style={{ backgroundColor: emotion.color }}
                ></span>
                <span className="text-base font-medium">
                  {index + 1}. {emotion.japaneseLabel}
                </span>
              </div>
              <span className="text-sm text-gray-600">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Data visualization */}
      {/* {hasSelectedEmotions && (
        <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">感情の分布</h2>
          <div className="h-64">
            <EmotionChart emotions={currentEntry.emotions} />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default EmotionLabeler;