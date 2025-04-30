import React from 'react';
import { BookOpen, Download } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Header: React.FC = () => {
  const { 
    hasEntries, 
    exportData, 
    progressPercentage, 
    completedEntries, 
    totalEntries 
  } = useData();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-800">テキスト感情ラベリングツール</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {hasEntries && (
              <>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      進捗状況: {completedEntries}/{totalEntries} ({Math.round(progressPercentage)}%)
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 transition-all duration-300 ease-in-out" 
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={exportData}
                  className="px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>エクスポート</span>
                </button>
              </>
            )}
          </div>
        </div>
        
        {hasEntries && (
          <div className="md:hidden mt-3">
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                進捗状況: {completedEntries}/{totalEntries} ({Math.round(progressPercentage)}%)
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300 ease-in-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;